enum BuildingTypeEnum {
  NORMAL = 'normal',
  VIP = 'vip',
}
namespace BuildingTypeEnum {
  export function allNames(): { [key: string]: string } {
    return {
      [BuildingTypeEnum.NORMAL]: 'Phòng thường',
      [BuildingTypeEnum.VIP]: 'Phòng vip',
    }
  }

  export function getNameByValue(value: BuildingTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default BuildingTypeEnum
