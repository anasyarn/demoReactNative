import React, { Fragment, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Formik, withFormik } from 'formik';

const EnterSubtotalForm = withFormik({})(Formik);

const style = StyleSheet.create({
  block: {
    marginBottom: 15,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input_item: {
    flexGrow: 9,
  },
  input_field: {
    height: 150,
    backgroundColor: 'yellow',
  },
  button_item: {
    marginTop: 25,
    marginLeft: 15,
    flexGrow: 3,
  },
  message: {},
});

export default ({ i18nT, onConfirm }) => {
  return (
    <View style={style.block}>
      <EnterSubtotalForm
        validate={(values, props) => {
          const errors = {};

          if (!values.amount) {
            errors.amount = i18nT('messages.required');
          } else if (values.amount <= 0) {
            errors.amount = i18nT('messages.should_be_more_than_zero');
          } else if (!values.amount.match(/^\d*(\.\d+)?$/)) {
            errors.amount = i18nT('messages.should_be_a_number');
          }

          return errors;
        }}
        initialValues={{ amount: '' }}
        onSubmit={(values) => {
          if (typeof onConfirm == 'function') onConfirm(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => {
          return (
            <View style={style.form}>
              <View style={style.input_item}>
                <TextField
                  label={i18nT('detail.enter_subtotal_input')}
                  name="amount"
                  labelTextStyle={{ paddingTop: 4 }}
                  keyboardType="numeric"
                  value={values.amount}
                  onChangeText={(value) => {
                    setFieldValue('amount', value);
                  }}
                  error={errors.amount}
                />
              </View>
              <View style={style.button_item}>
                <Button
                  color="#27ae60"
                  titleColor="#ffffff"
                  onPress={handleSubmit}
                  title={i18nT('detail.enter_subtotal_button')}
                  disabled={values.amount <= 0}
                />
              </View>
            </View>
          );
        }}
      </EnterSubtotalForm>
      <View style={style.message}>
        <Text>{i18nT('detail.enter_subtotal_message')}</Text>
      </View>
    </View>
  );
};
