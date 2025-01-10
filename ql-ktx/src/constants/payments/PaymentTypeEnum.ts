enum PaymentTypeEnum {
  UN_ACTIVE = 'unactive',
  ACTIVE = 'active',
}

namespace PaymentTypeEnum {
  export function allNames(): { [key: string]: string } {
    return {
      [PaymentTypeEnum.UN_ACTIVE]: 'Chưa thanh toán',
      [PaymentTypeEnum.ACTIVE]: 'Đã thanh toán',
    }
  }

  export function getNameByValue(value: PaymentTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default PaymentTypeEnum
