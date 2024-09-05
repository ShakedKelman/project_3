export class VacationModel {
    id?: number;
    destination: string;
    description: string;
    startDate: string; // ISO date string or format you prefer
    endDate: string; // ISO date string or format you prefer
    price: number;
    imageFileName?: string;
  
    constructor(obj: Partial<VacationModel>) {
        this.id = obj.id;
        this.destination = obj.destination ?? '';
        this.description = obj.description ?? '';
        this.startDate = obj.startDate ?? '';
        this.endDate = obj.endDate ?? '';
        this.price = obj.price ?? 0;
        this.imageFileName = obj.imageFileName;
    }
}
