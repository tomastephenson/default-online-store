import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Icon,
  Text,
  Stack,
  Code,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { IoCardOutline, IoClose } from 'react-icons/io5'
import { useCheckout } from '../../../hooks'
import { SectionHeader } from '@composable/ui'
import { FormBillingAddress } from './form-billing-address'
import { PaymentElement } from '@stripe/react-stripe-js'
import { useEffect } from 'react'
import { BsCashCoin } from 'react-icons/bs'
import { OfflinePayment } from './offline-payment'
import { PAYMENT_METHOD } from '../constants'
import { FiPlus } from 'react-icons/fi'
import { memo } from 'react'

const SetYourStripeAccount = () => (
  <Stack bg={'info.200'} padding={4}>
    <Text textStyle={'Desktop/Body-L'}>
      To use stripe, add your own stripe keys to `.env`
    </Text>
    <Code>
      <Text>STRIPE_SECRET_KEY=sk_test_...</Text>
      <Text>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</Text>
    </Code>
  </Stack>
)

interface PaymentMethodSectionProps {
  stripeError?: boolean
}

export const PaymentMethodSection = memo(function PaymentMethodSection({
  stripeError = false,
}: PaymentMethodSectionProps) {
  const intl = useIntl()
  const {
    paymentHandler: { register, select, list },
  } = useCheckout()
  const stripeAvailable =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !stripeError

useEffect(() => {
    register({
      key: PAYMENT_METHOD.STRIPE,
      title: intl.formatMessage({
        id: 'checkout.paymentSection.stripe.paymentMethodTitle',
      }),
      icon: IoCardOutline,
    })
  }, [intl, register])

  const handleSelectPaymentMethod = (isSelected: boolean, key: string) => {
    if (isSelected) {
      // Payment by cash if no stripe
      select(!stripeAvailable ? PAYMENT_METHOD.CASH : key)
    } else {
      select()
    }
  }

  return (
    <Box>
                        {pmtMethod.key === PAYMENT_METHOD.STRIPE &&
                          (!stripeAvailable ? (
                            <SetYourStripeAccount />
                          ) : (
                            <PaymentElement />
                          ))}
                        <BillingAddressSubsection />
                      </>
                    
    </Box>
  )


const BillingAddressSubsection = () => {
  const intl = useIntl()
  const { checkoutState, setCheckoutState } = useCheckout()
  const {
    config: { billingSameAsShipping },
  } = checkoutState

  return (
    <Box mt={8}>
      <SectionHeader
        title={intl.formatMessage({
          id: 'checkout.payment.paymentMethodSection.billingAddressSubsection.title',
        })}
        requiredMarkText={
          billingSameAsShipping
            ? undefined
            : intl.formatMessage({ id: 'section.required' })
        }
        textProps={{ fontSize: 'lg' }}
        boxProps={{ mb: 'sm' }}
      />

      <FormBillingAddress
        initialValues={checkoutState.billing_address}
        onChange={({ data, isValid }) => {
          if (!isValid) {
            return
          }

          setCheckoutState((state) => {
            return {
              ...state,
              billing_address: data,
            }
          })
        }}
      />
    </Box>
  )
}
