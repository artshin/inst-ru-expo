type Matrix = {
  size: number
  values: string[]
}

type Routes =
  | 'Home'
  | 'Search'
  | 'Likes'
  | 'Profile'
  | 'Inst'
  | 'Breach'
  | 'Settings'
  | 'Root'

type RootStackParamList = {
  Inst: undefined
  Breach: undefined
  Settings: undefined
  Root: undefined
}

type InstTabStackParamList = {
  Home: undefined
  Search: undefined
  Likes: undefined
  Profile: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface InstTabParamList extends InstTabStackParamList {}
  }
}
