export interface CoursePackage {
  id: string
  name: string
  description: string
  priceInCents: number
  classes: number
  courseId?: string
}

// Source of truth for all course packages
export const COURSE_PACKAGES: CoursePackage[] = [
  {
    id: "basic-10",
    name: "基础套餐 - 10课时",
    description: "适合初学者的入门套餐",
    priceInCents: 99900, // $999
    classes: 10,
  },
  {
    id: "standard-20",
    name: "标准套餐 - 20课时",
    description: "最受欢迎的标准学习套餐",
    priceInCents: 189900, // $1899
    classes: 20,
  },
  {
    id: "premium-50",
    name: "高级套餐 - 50课时",
    description: "深度学习的完整课程套餐",
    priceInCents: 449900, // $4499
    classes: 50,
  },
  {
    id: "ultimate-100",
    name: "终极套餐 - 100课时",
    description: "全面掌握的专业级套餐",
    priceInCents: 799900, // $7999
    classes: 100,
  },
]

export function getPackageById(packageId: string): CoursePackage | undefined {
  return COURSE_PACKAGES.find((p) => p.id === packageId)
}

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`
}
