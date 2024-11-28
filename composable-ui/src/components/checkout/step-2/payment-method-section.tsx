import {
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
import { useEffect, useState } from 'react'  // Import useState for managing isSelected
import { BsCashCoin } from 'react-icons/bs'
import { FormBillingAddress } from './form-billing-address'
import { OfflinePayment } from './offline-payment'
import { PAYMENT_METHOD } from '../constants'
import { FiPlus } from 'react-icons/fi'
import { memo } from 'react'

  useEffect(() => {
  // Set the initial isSelected state to true to expand the accordion
  setIsSelected(true);
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
    setIsSelected(true)  // Update isSelected state
    if (isSelected) {
      // Only allow selecting stripe
      select(stripeAvailable ? key : undefined) // Select stripe if available, otherwise do nothing
    } else {
      select()
    }
  }

  return (    <Box key={PAYMENT_METHOD.STRIPE} borderTop={0}>
            <Box flex="1" textAlign="left">
              {intl.formatMessage({
                id: 'checkout.paymentSection.stripe.paymentMethodTitle',
              })}
            </Box>
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
    </Box>
  )

const BillingAddressSubsection = () => {
  const intl = useIntl()
  const { checkoutState, setCheckoutState } = useCheckout()
  const {
    config: { billingSameAsShipping },
  } = checkoutState

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
}
