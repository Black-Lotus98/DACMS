import { z } from 'zod';
import { RecordStatus, SecrecyLevel } from '../types';

export const registerRecordSchema = z.object({
  refNo:       z.string().min(1),
  titleAr:     z.string().min(2),
  titleEn:     z.string().min(2),
  docTypeId:   z.string().min(1),
  categoryId:  z.string().min(1),
  boxId:       z.string().min(1),
  shelfId:     z.string().min(1),
  secrecy:     z.nativeEnum(SecrecyLevel),
  issueDate:   z.string().min(1),
  archiveDate: z.string().min(1),
  retentionEnd: z.string().min(1),
  createdBy:   z.string().min(1),
  metadata:    z.record(z.string(), z.string()).default({}),
});

export const moveRecordSchema = z.object({
  recordId: z.string().min(1),
  toBox:    z.string().min(1),
  movedBy:  z.string().min(1),
  reason:   z.string().min(1),
});

export const updateRecordStatusSchema = z.object({
  recordId: z.string().min(1),
  status:   z.nativeEnum(RecordStatus),
});

export const recordFileSchema = z.object({
  recordId:   z.string().min(1),
  fileName:   z.string().min(1),
  fileType:   z.string().min(1),
  fileUrl:    z.string().url(),
  uploadedBy: z.string().min(1),
});
