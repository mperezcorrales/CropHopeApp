// export interface FundraiserProfile {
//     id: string;
//     description: string;
//     websiteURL: string;
//     phoneNumber: string;
//     carbonFootprint: string;
//     carbonReductionPerc: number;
//     logoStorageId: string;
// }

export class FundraiserProfile {
    id = '';
    description = '';
    websiteURL = '';
    phoneNumber = '';
    carbonFootprint = '';
    carbonReductionPerc = '';
    logoStorageURL = '';

    clear() {
        this.description = '';
        this.websiteURL = '';
        this.phoneNumber = '';
        this.carbonFootprint = '';
        this.carbonReductionPerc = '';
        this.logoStorageURL = '';
    }

    allParamsAreFilled() {
        return this.description !== '' && this.websiteURL !== '' && this.phoneNumber !== '' &&
        this.carbonFootprint !== '' && this.carbonReductionPerc !== '';
    }
}
