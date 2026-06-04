import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(page = 1, limit = 10) {
    const supabase = this.supabaseService.getClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);

    // Get emails from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const emailMap = new Map<string, string | undefined>(
      authUsers.users.map((u): [string, string | undefined] => [u.id, u.email]),
    );

    const users = (data ?? []).map((p) => ({
      ...p,
      email: emailMap.get(p.id) ?? null,
    }));

    return {
      users,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !profile) throw new NotFoundException('Pengguna tidak ditemukan');

    const { data: authUser } = await supabase.auth.admin.getUserById(id);

    return { ...profile, email: authUser.user?.email ?? null };
  }

  async update(id: string, dto: UpdateUserDto) {
    const supabase = this.supabaseService.getClient();

    await this.findOne(id);

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();

    await this.findOne(id);

    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw new InternalServerErrorException(error.message);

    return { message: 'Pengguna berhasil dihapus' };
  }
}
