import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // Check if email exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', dto.email)
      .maybeSingle();

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const userId = authData.user!.id;

    // Insert profile record
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: dto.full_name,
      role: 'user',
    });

    if (profileError) {
      // Rollback auth user
      await supabase.auth.admin.deleteUser(userId);
      throw new InternalServerErrorException(
        'Gagal membuat profil: ' + profileError.message,
      );
    }

    const token = this.jwtService.sign({
      sub: userId,
      email: dto.email,
      role: 'user',
    });

    return {
      access_token: token,
      user: {
        id: userId,
        email: dto.email,
        full_name: dto.full_name,
        role: 'user',
      },
    };
  }

  async login(dto: LoginDto) {
    // Use a fresh anon client ONLY for password verification
    // so that signInWithPassword does NOT pollute the service-role singleton session
    const anonClient = this.supabaseService.createAnonClient();
    const supabase = this.supabaseService.getClient(); // service-role for DB queries

    const { data: authData, error: authError } =
      await anonClient.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (authError || !authData.user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const userId = authData.user.id;

    // Fetch profile using service-role client (bypasses RLS)
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Safety net: if profile somehow missing, create it now
    if (!profile) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const fallbackName =
        (authUser?.user?.user_metadata?.full_name as string | undefined) ??
        dto.email.split('@')[0];

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: fallbackName, role: 'user' })
        .select()
        .single();

      if (insertError || !newProfile) {
        throw new UnauthorizedException(
          'Profil pengguna tidak ditemukan dan gagal dibuat',
        );
      }
      profile = newProfile;
    }

    const token = this.jwtService.sign({
      sub: userId,
      email: dto.email,
      role: profile.role,
    });

    return {
      access_token: token,
      user: {
        id: userId,
        email: dto.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      },
    };
  }

  async getMe(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    const { data: authUser } = await supabase.auth.admin.getUserById(userId);

    return {
      id: profile.id,
      email: authUser.user?.email,
      full_name: profile.full_name,
      role: profile.role,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
    };
  }
}
