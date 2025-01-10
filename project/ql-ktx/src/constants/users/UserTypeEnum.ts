enum UserTypeEnum {
  SUP_ADMIN = 'sup_admin',
  ADMIN = 'admin',
  STUDENT = 'user',
}
namespace UserTypeEnum {
  export function allNames(): { [key: string]: string } {
    return {
      [UserTypeEnum.SUP_ADMIN]: 'Quản trị viên',
      [UserTypeEnum.ADMIN]: 'Quản lý',
      [UserTypeEnum.STUDENT]: 'sinh viên',
    }
  }

  export function getNameByValue(value: UserTypeEnum): string {
    const names = allNames()
    return names[value]
  }
}

export default UserTypeEnum
