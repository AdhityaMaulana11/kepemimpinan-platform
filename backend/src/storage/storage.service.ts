import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const BUCKET = 'kepemimpinan-files';

@Injectable()
export class StorageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<{ publicUrl: string; storagePath: string }> {
    const supabase = this.supabaseService.getClient();
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const storagePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        'Gagal mengunggah file: ' + error.message,
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return {
      publicUrl: data.publicUrl,
      storagePath,
    };
  }

  async deleteFile(storagePath: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (error) {
      throw new InternalServerErrorException(
        'Gagal menghapus file: ' + error.message,
      );
    }
  }

  async getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, expiresIn);

    if (error || !data) {
      throw new InternalServerErrorException(
        'Gagal membuat signed URL: ' + (error?.message ?? ''),
      );
    }

    return data.signedUrl;
  }
}
