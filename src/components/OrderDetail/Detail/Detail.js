import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import Button from '../../Button/Button'

export default function Detail({
  theme,
  from,
  orderNo,
  deliveryAddress,
  items,
  currencySymbol,
  subTotal,
  tip,
  tax,
  deliveryCharges,
  total,
  navigation,
  id,
  rider
}) {
  return (
    <View style={styles.container(theme)}>
      {rider && (
        <>
          <View
            style={{
              paddingVertical: 20
            }}>
            <Button
              buttonProps={{
                onPress: () => navigation.navigate('ChatWithRider', { id })
              }}
              buttonStyles={styles.chatButton(theme)}
              textStyles={styles.chatButtonText(theme)}
              text={'Chat with Rider'}
            />
          </View>
          <View style={styles.line(theme)}></View>
        </>
      )}
      <View
        style={{
          paddingTop: 20
        }}>
        <TextDefault textColor={theme.buttonTextPink} bold H3 textColor={theme.buttonTextPink}>
          Order Detail
        </TextDefault>
      </View>
      <View style={[styles.addressContainer, styles.shadowBox(theme)]}>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.buttonTextPink}
            bold
            style={styles.addressText}>
            Your order from:
          </TextDefault>
          <TextDefault left bolder style={styles.addressText} textColor={theme.buttonTextPink}>
            {from}
          </TextDefault>
        </View>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.buttonTextPink}
            bold
            style={styles.addressText}>
            Your order no:
          </TextDefault>
          <TextDefault left bolder style={styles.addressText} textColor={theme.buttonTextPink}>
            {' '}
            {orderNo}
          </TextDefault>
        </View>
        <View style={styles.row}>
          <TextDefault
            left
            textColor={theme.buttonTextPink}
            bold
            style={styles.addressText}>
            Delivery address:
          </TextDefault>
          <TextDefault left bolder style={styles.addressText} numberOfLines={4} textColor={theme.buttonTextPink}>
            {deliveryAddress}
          </TextDefault>
        </View>
      </View>
      <View style={[styles.itemsContainer, styles.shadowBox(theme)]}>
        {items.map(item => (
          <ItemRow
            key={item.id}
            theme={theme}
            quantity={item.quantity}
            title={`${item.title} ${item.variation.title}`}
            currency={currencySymbol}
            price={item.variation.price}
            options={item?.addons?.map(addon =>
              addon.options.map(({ title }) => title)
            )}
          />
        ))}
        <View>
          <PriceRow
            theme={theme}
            title={'Subtotal'}
            currency={currencySymbol}
            price={subTotal}
          />
          <PriceRow
            theme={theme}
            title={'Tip'}
            currency={currencySymbol}
            price={tip}
          />
          <PriceRow
            theme={theme}
            title={'Tax charges'}
            currency={currencySymbol}
            price={tax}
          />
          <PriceRow
            theme={theme}
            title={'Delivery charges'}
            currency={currencySymbol}
            price={deliveryCharges}
          />
          <View style={{ marginVertical: 20 }} />
          <PriceRow
            theme={theme}
            title={'Total'}
            currency={currencySymbol}
            price={total}
          />
        </View>
      </View>
    </View>
  )
}
const ItemRow = ({
  theme,
  quantity,
  title,
  options = ['raita', '7up'],
  price,
  currency
}) => {
  return (
    <View>
      <View style={styles.itemRow}>
        <TextDefault left style={{ width: '10%' }} bolder textColor={theme.buttonTextPink}>
          {quantity}x
        </TextDefault>
        <View style={{ width: '60%' }}>
          <TextDefault
            left
            textCoonumberOfLines={4}
            textColor={theme.buttonTextPink}>
            {title}
          </TextDefault>
          {options.map((option, index) => (
            <TextDefault
              small
              textColor={theme.buttonTextPink}
              left
              key={title + option + index}>
              +{option}
            </TextDefault>
          ))}
        </View>
        <TextDefault
          right
          style={{ width: '20%' }}
          textColor={theme.buttonTextPink}
          H5>
          {currency} {price}
        </TextDefault>
      </View>
      <View style={styles.line2(theme)}></View>
    </View>
  )
}

const PriceRow = ({ theme, title, currency, price }) => {
  return (
    <View style={styles.priceRow}>
      <TextDefault H5 textColor={theme.buttonTextPink}>
        {title}
      </TextDefault>
      <TextDefault H5 textColor={theme.buttonTextPink}>
        {currency} {price}
      </TextDefault>
    </View>
  )
}
