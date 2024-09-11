const categories = [
  {
    title: 'Appetizers',
    foods: [
      {
        id: '5',
        title: 'Nuggets',
        description: 'Yummy Nuggets',
        variations: [
          { id: '1', price: 300, discounted: 0, title: '6 Pcs' },
          { id: '2', price: 500, discounted: 0, title: '12 Pcs' }
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRWxZPsEMaQe5OY7M0arhmU2suQIyTPLRPFFpHFk28UIhfq7hH8MFFd0C&s=10'
      },
      {
        id: '5',
        title: 'Wings',
        description: 'Yummy Wings',
        variations: [
          { id: '1', price: 300, discounted: 0, title: '6 Pcs' },
          { id: '2', price: 500, discounted: 0, title: '12 Pcs' }
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqZsmpI5Q_mq9x5t-ClmAVZH3AnnheX8V7dr9au1I-7UQ8P6s4Zz50eBlp&s=10'
      }
    ]
  },
  {
    title: 'Fries',
    foods: [
      {
        id: '5',
        title: 'Cheesy Fries',
        description: 'Yummy Cheesy Fries',
        variations: [{ id: '1', price: 700, discounted: 0, title: '' }],
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_avQMDXWUSzpclsR4rPOjzdloERb7OMhmkrvAKQCU28Mds5dFglCEJQA&s=10'
      }
    ]
  },
  {
    title: 'Burgers',
    foods: [
      {
        id: '3',
        title: 'Big Bang',
        description: 'Yummy Big Bang',
        variations: [{ id: '3', price: 850, discounted: 0, title: '' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0oIOVKnmyvKY4XBnl5_3IpH0fKzR5zaN3K_R44VhTYmxz1NhNBkatwSyy&s=10'
      }
    ]
  },
  {
    title: 'Pastas',
    foods: [
      {
        id: '5',
        title: 'Oven Baked Pasta',
        description: 'Yummy Oven Baked Pasta',
        variations: [{ id: '5', price: 1000, discounted: 0, title: '' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLYkdxQjXFknEZV2RJfqMoU6leEypbrDq8hxbQ5d2dSRu4UDoUgqodGLY&s=10'
      }
    ]
  },
  {
    title: 'Sandwiches',
    foods: [
      {
        id: '5',
        title: 'Steak Sandwitch',
        description: 'Yummy Steak Sandwitch',
        variations: [{ id: '5', price: 800, discounted: 0, title: '' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTpUMsRRhuxF0QGx9IaUNP5-ENTMPSgE-apA&usqp=CAU'
      }
    ]
  },
  {
    title: 'Wraps',
    foods: [
      {
        id: '5',
        title: 'Chipotle Wrap',
        description: 'Yummy maxican Wrap',
        variations: [{ id: '5', price: 600, discounted: 0, title: '' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkw7jUvyV6SQumtotpOr-ApX2OAACVd8BphczZnMzHKMNAUYACeCxp0hkE&s=10'
      }
    ]
  },
  {
    title: 'Platters',
    foods: [
      {
        id: '5',
        title: 'Maxican Wrap',
        description: 'Yummy Maxican Wrap',
        variations: [{ id: '5', price: 800, discounted: 0, title: '' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Ob7qC2AWEGsoJHm04nYlM8jT-946MH_bGY-7fpaxf_yB_XRFhweqfno&s=10'
      }
    ]
  },

  {
    title: 'Pizzas',
    foods: [
      {
        id: '1',
        title: 'Peri Peri Pizza',
        description: 'Yummy Peri Peri Pizza',
        variations: [{ id: '1', price: 1500, discounted: 0, title: 'Small' }, { id: '2', price: 1800, discounted: 0, title: 'Medium' }, { id: '3', price: 2000, discounted: 0, title: 'Large' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiaccfLMFt5XLmOnRKVTRMrhu8R-JpDWjfLv7OA6G2XhHKfN-xJSsltCdS&s=10'
      },
      {
        id: '2',
        title: 'Bihari Kabab Pizza',
        description: 'Yummy Bihari Kabab Pizza',
        variations: [{ id: '1', price: 1500, discounted: 0, title: 'Small' }, { id: '2', price: 1800, discounted: 0, title: 'Medium' }, { id: '3', price: 2000, discounted: 0, title: 'Large' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTneDJsoR3d7ovOfTN5K_ys2PuFowwelTMNkA&usqp=CAU'
      },
      {
        id: '3',
        title: 'Royal Crust Pizza',
        description: 'Yummy Royal Crust Pizza',
        variations: [{ id: '1', price: 1500, discounted: 0, title: 'Small' }, { id: '2', price: 1800, discounted: 0, title: 'Medium' }, { id: '3', price: 2000, discounted: 0, title: 'Large' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRULDP49aNtv-jbXvli7DkHVH5MNHQgQQ5kZA&usqp=CAU'
      }
    ]
  },
  {
    title: 'Extras',
    foods: [
      {
        id: '5',
        title: 'Coke',
        description: 'Yummy Coke',
        variations: [{ id: '1', price: 120, discounted: 0, title: '250 Ml' }, { id: '2', price: 250, discounted: 0, title: '0.5 Ltr' }],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ_CRTMpTSiOqmUX391jPuwvLSBqJilzh_3BcA1-gJn3C4WNn8R_8n788R&s=10'
      }
    ]
  }
]

export default categories;
