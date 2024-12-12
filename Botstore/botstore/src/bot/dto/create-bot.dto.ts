export class CreateBotDto {
    name: string;
    description: string;
    features: string[];
    price: number;
    imageUrl: string;
    useCases?: string[];
    benefits?: string[];
    demoUrl?: string;
  }
  