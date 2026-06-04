import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }

  async create(dto: CreateCategoryDto) {
    const supabase = this.supabaseService.getClient();

    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', dto.slug)
      .maybeSingle();

    if (existing) throw new ConflictException('Slug sudah digunakan');

    const { data, error } = await supabase
      .from('categories')
      .insert(dto)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const supabase = this.supabaseService.getClient();

    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) throw new NotFoundException('Kategori tidak ditemukan');

    const { data, error } = await supabase
      .from('categories')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) throw new NotFoundException('Kategori tidak ditemukan');

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Kategori berhasil dihapus' };
  }
}
