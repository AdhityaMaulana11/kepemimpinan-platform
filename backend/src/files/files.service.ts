import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService } from '../storage/storage.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';

const ALLOWED_TYPES = [
  'pdf', 'docx', 'pptx', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm',
];

@Injectable()
export class FilesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  async findAll(query: {
    category?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    const supabase = this.supabaseService.getClient();
    const { category, type, search, page = 1, limit = 12, sort = 'created_at' } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
      .from('files')
      .select('*, categories(id, name, slug), profiles(id, full_name)', { count: 'exact' })
      .eq('is_published', true)
      .order(sort, { ascending: false })
      .range(from, to);

    if (category) q = q.eq('category_id', category);
    if (type) q = q.eq('file_type', type);
    if (search) q = q.ilike('title', `%${search}%`);

    const { data, error, count } = await q;
    if (error) throw new InternalServerErrorException(error.message);

    return {
      files: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  async findOne(id: string, viewerId?: string) {
    const supabase = this.supabaseService.getClient();

    const { data: file, error } = await supabase
      .from('files')
      .select('*, categories(id, name, slug), profiles(id, full_name)')
      .eq('id', id)
      .single();

    if (error || !file) throw new NotFoundException('File tidak ditemukan');

    // Record view
    if (viewerId) {
      await supabase.from('file_views').insert({
        file_id: id,
        viewer_id: viewerId,
      });
    }

    return file;
  }

  async upload(
    file: Express.Multer.File,
    dto: CreateFileDto,
    uploadedBy: string,
  ) {
    const ext = path.extname(file.originalname).replace('.', '').toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      throw new BadRequestException(
        `Tipe file tidak didukung. Gunakan: ${ALLOWED_TYPES.join(', ')}`,
      );
    }

    const { publicUrl, storagePath } = await this.storageService.uploadFile(
      file,
      'uploads',
    );

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('files')
      .insert({
        title: dto.title,
        description: dto.description,
        file_type: ext,
        file_url: publicUrl,
        storage_path: storagePath,
        file_size: file.size,
        category_id: dto.category_id ?? null,
        uploaded_by: uploadedBy,
        is_published: dto.is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      await this.storageService.deleteFile(storagePath);
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async update(id: string, dto: UpdateFileDto) {
    const supabase = this.supabaseService.getClient();
    await this.findOne(id);

    const { data, error } = await supabase
      .from('files')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();
    const file = await this.findOne(id);

    await this.storageService.deleteFile(file.storage_path);

    const { error } = await supabase.from('files').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);

    return { message: 'File berhasil dihapus' };
  }

  async getDownloadUrl(id: string) {
    const supabase = this.supabaseService.getClient();
    const file = await this.findOne(id);

    // Increment download count
    await supabase
      .from('files')
      .update({ download_count: (file.download_count ?? 0) + 1 })
      .eq('id', id);

    const signedUrl = await this.storageService.getSignedUrl(file.storage_path);

    return { download_url: signedUrl, file_name: file.title };
  }

  async getStats() {
    const supabase = this.supabaseService.getClient();

    const [filesResult, viewsResult] = await Promise.all([
      supabase.from('files').select('file_type, download_count, is_published'),
      supabase.from('file_views').select('id', { count: 'exact', head: true }),
    ]);

    const files = filesResult.data ?? [];
    const totalFiles = files.filter((f) => f.is_published).length;
    const totalDownloads = files.reduce(
      (sum, f) => sum + (f.download_count ?? 0),
      0,
    );
    const totalViews = viewsResult.count ?? 0;

    const byType: Record<string, number> = {};
    for (const f of files) {
      byType[f.file_type] = (byType[f.file_type] ?? 0) + 1;
    }

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    return {
      totalFiles,
      totalDownloads,
      totalViews,
      totalUsers: totalUsers ?? 0,
      byType,
    };
  }
}
