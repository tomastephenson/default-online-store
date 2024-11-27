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
    paymentHandler: { register, select },
  } = useCheckout()
  const stripeAvailable =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !stripeError

  useEffect(() => {
    // Register only the stripe payment method
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
      // Only allow selecting stripe
      select(stripeAvailable ? key : undefined) // Select stripe if available, otherwise do nothing
    } else {
      select()
    }
  }

  return (
    <Box>
      <Accordion allowToggle>
        {/* Only display the Stripe payment method item */}
        <AccordionItem key={PAYMENT_METHOD.STRIPE} borderTop={0}>
              <AccordionButton
                fontSize="base"
                px={0}
                py="sm"
                gap="xxs"
                onClick={() => {
                  handleSelectPaymentMethod(PAYMENT_METHOD.STRIPE)
                }}
                _hover={{ bg: 'none' }}
              >
                <Icon as={IoCardOutline} />
                <Box flex="1" textAlign="left">
                  {intl.formatMessage({
                    id: 'checkout.paymentSection.stripe.paymentMethodTitle',
                  })}
                </Box>
              {isSelected ? <Icon as={IoClose} /> : <Icon as={FiPlus} />}
              </AccordionButton>
              <AccordionPanel px={0} pb={0}>
                <Box bg="shading.100" p="sm">
                    <>
                      {stripeAvailable ? ( // Only show PaymentElement if stripe is available
                        <PaymentElement />
                      ) : (
                        <SetYourStripeAccount /> // Display message if stripe is not available
                      )}
                      <BillingAddressSubsection />
                    </>
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Box>
  )
})

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
