enum UserGenderEnum {
  NAM = 'male',
  NU = 'female',
}
namespace UserGenderEnum {
  export function allNames(): { [key: string]: string } {
    return {
      [UserGenderEnum.NAM]: 'Nam',
      [UserGenderEnum.NU]: 'Nữ',
    }
  }

  export function getNameByValue(value: UserGenderEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default UserGenderEnum
