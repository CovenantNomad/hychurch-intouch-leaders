export interface SelectType {
  id: string
  name: string
}

//새가족셀: 39, 블레싱셀: 47, 새싹셀: 44
export enum SpecialCellIdType {
  /** 새가족셀 (정우현) */
  NewFamily = '39',
  /** 블레싱셀 (백선경) */
  Blessing = '47',
  /** 새싹셀 (이찬양) */
  Renew = '44',
}

export enum StepStatus {
  COMPLETE = 'complete',
  CURRENT = 'current',
  UPCOMING = 'upcoming',
}
