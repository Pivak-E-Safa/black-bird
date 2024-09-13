import categories from './categories'

const restaurants = [
  {
    id: '1',
    name: 'Love Bites, Chiniot',
    area: 'CHINIOT',
    image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-badshahi-mosque-asim-minto.jpg',
    categories: categories,
    deliveryTime: 50,
    minimumOrder: 500,
    isAvailable: true,
    openingTimes: [
      { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
    ],
    location: { latitude: 31.730152279082226, longitude: 72.9811285828689 },
    address: 'Sargodha Road, Chiniot'
  },
  {
    id: '2',
    name: 'Love Bites, Sargodha',
    area: 'SARGODHA',
    image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-badshahi-mosque-asim-minto.jpg',
    categories: categories,
    deliveryTime: 50,
    minimumOrder: 500,
    isAvailable: true,
    openingTimes: [
      { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
    ],
    location: { latitude: 31.730152279082226, longitude: 72.9811285828689 },
    address: 'Sargodha Road, Chiniot'
  },
  {
    id: '3',
    name: 'Love Bites, Faisalabad',
    area: 'FAISALABAD',
    image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-badshahi-mosque-asim-minto.jpg',
    categories: categories,
    deliveryTime: 50,
    minimumOrder: 500,
    isAvailable: true,
    openingTimes: [
      { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
      { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
    ],
    location: { latitude: 31.730152279082226, longitude: 72.9811285828689 },
    address: 'Sargodha Road, Chiniot'
  }
]

export default restaurants
