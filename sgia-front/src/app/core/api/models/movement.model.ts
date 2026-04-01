export type MovementType = 'Entry' | 'Exit';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  type: MovementType;
  quantity: number;
  reason: string;
  movementDate: string;
  createdAt: string;
}

export interface CreateMovementDto {
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  movementDate?: string;
}
