export class FundraiserProfile {
    userId = '';
    entityName = '';
    email = '';
    description = '';
    websiteURL = '';
    phoneNumber = '';
    carbonFootprint = '';
    carbonReductionPerc = '';
    logoStorageURL = '';
    isFilled = false;

    constructor(profileInterface) {
        if (profileInterface) {
            this.userId = profileInterface.userId;
            this.entityName = profileInterface.entityName;
            this.email = profileInterface.email;
            this.description = profileInterface.description;
            this.websiteURL = profileInterface.websiteURL;
            this.phoneNumber = profileInterface.phoneNumber;
            this.carbonFootprint = profileInterface.carbonFootprint;
            this.carbonReductionPerc = profileInterface.carbonReductionPerc;
            this.logoStorageURL = profileInterface.logoStorageURL;
            this.isFilled = profileInterface.isFilled;
        }
    }

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
