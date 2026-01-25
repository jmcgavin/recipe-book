import { pretzel } from '@lucide/lab'
import {
  BicepsFlexed,
  CakeSlice,
  ChefHat,
  CookingPot,
  EggFried,
  Icon,
  LeafyGreen,
  Salad,
  Snowflake,
  Soup,
  Utensils,
  Vegan,
  Wheat,
} from 'lucide-react'

type Props = {
  tag: string
  size?: number
}

export const getTagIcon = ({ tag, size = 16 }: Props) => {
  switch (tag) {
    case 'Breakfast':
      return <EggFried size={size} />
    case 'Dessert':
      return <CakeSlice size={size} />
    case 'Freezable':
      return <Snowflake size={size} />
    case 'High protein':
      return <BicepsFlexed size={size} />
    case 'Main course':
      return <Utensils size={size} />
    case 'Other':
      return <ChefHat size={size} />
    case 'Pasta':
      return <Wheat size={size} />
    case 'Salad':
      return <Salad size={size} />
    case 'Side dish':
      return <Icon iconNode={pretzel} size={size} />
    case 'Slow cooker':
      return <CookingPot size={size} />
    case 'Soup':
      return <Soup size={size} />
    case 'Vegan':
      return <Vegan size={size} />
    case 'Vegetarian':
      return <LeafyGreen size={size} />
    default:
      return null
  }
}
