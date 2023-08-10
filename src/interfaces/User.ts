
export interface RandomUserResponse {
  results: RandomUser[];
}

export interface RandomUser {
  gender: string;
  name: NameDetails;
  location: LocationDetails;
  email: string;
  dob: DateOfBirthInterface;
  login: LoginDetail;
  registered: RegisteredDetails;
  phone: string;
  cell: string;
  id: Identity;
  picture: ImagesInterface;
  nat: string
}

export interface LoginDetail {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}
export interface DateOfBirthInterface {
  date: string;
  age: number;
}

export interface RegisteredDetails {
  date: string;
  age: number;
}

export interface ImagesInterface {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface Identity {
  name: string;
  value: string;
}

export interface NameDetails {
  title: string;
  first: string;
  last: string;
}


export interface LocationDetails {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Street {
  number: number;
  name: string;
}

export interface Coordinates {
  longitude: string;
  latitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}
