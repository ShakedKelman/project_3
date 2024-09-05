import { ValidationError } from "./exceptions";
import Joi from "joi";

interface VacationInterface {
    id?: number;
    destination: string;
    description: string;
    startDate: string; // ISO date string or format you prefer
    endDate: string; // ISO date string or format you prefer
    price: number;
    imageFileName: string;
}

export default class VacationModel {
    id?: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageFileName: string;

    constructor(vacation: VacationInterface) {
        this.id = vacation.id;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageFileName = vacation.imageFileName;
    }

    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        destination: Joi.string().required().min(2).max(100),
        description: Joi.string().required().min(5).max(255),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().greater(Joi.ref('startDate')),
        price: Joi.number().required().positive(),
        imageFileName: Joi.string().required().min(1).max(255),
    });

    validate(): void {
        const res = VacationModel.validateSchema.validate(this, { abortEarly: false });
        if (res.error) {
            throw new ValidationError(res.error.details.map(d => d.message).join(", "));
        }
    }
}
