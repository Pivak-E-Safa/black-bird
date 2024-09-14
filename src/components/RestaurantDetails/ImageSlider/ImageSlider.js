import React, { useState, useRef } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const ImageSlider = ({ images, marginTop, paddingTop }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { width } = Dimensions.get('window');

  const renderItem = ({ item }) => {
    return (
      <View>
        <Image
          source={
            typeof item === 'string' && item.startsWith('http')
              ? { uri: item }
              : item
          }
          style={{
            marginTop: marginTop,
            width: width,
            height: 180,
            borderRadius: 10
          }}
        />
      </View>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      data={images}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={width - 60}
      onSnapToItem={(index) => setActiveIndex(index)}
      loop={true}
      autoplay={true}
      autoplayDelay={500}
    />
  );
};

export default ImageSlider;
