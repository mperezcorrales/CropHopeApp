export interface Transaction {
    id?: string;
    status?: string;
    denied?: boolean;
    accepted?: boolean;
    fromId: string;
    fromName: string;
    fromEmail: string;
    acceptedByFrom: boolean;
    toId: string;
    acceptedByTo: boolean;
    givingToCompanyName: string;
    carbonReductionPerc: string;
    timeWindow: string;
    currentDate: string;
    amount: string;
}
