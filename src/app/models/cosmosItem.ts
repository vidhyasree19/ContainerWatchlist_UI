export interface CosmosItem {
    containerNumber: string;
    tradeType: string;
    status: string;
    vesselName: string;
    vesselCode?: string;
    voyage?: string;
    origin?: string;
    line?: string;
    destination?: string;
    sizeType?: string;
    fees:string;
    cartAdded: boolean;
    id?: string; // Optional field, it can be generated later
  }
  