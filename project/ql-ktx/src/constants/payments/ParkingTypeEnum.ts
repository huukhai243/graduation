enum ParkingTypeEnum {
  BIKE = 'bike',
  MOTO = 'moto',
}

namespace ParkingTypeEnum {
  export function allNames(): { [key: string]: string } {
    return {
      [ParkingTypeEnum.BIKE]: 'Xe đạp',
      [ParkingTypeEnum.MOTO]: 'Xe máy',
    }
  }

  export function getNameByValue(value: ParkingTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default ParkingTypeEnum
