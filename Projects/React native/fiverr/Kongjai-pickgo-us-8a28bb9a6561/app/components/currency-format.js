import React from 'react';
import NumberFormat from 'react-number-format';
import { Text } from 'react-native';
/* dollars
const CurrFormat = ({ value }) => (
  <NumberFormat
    displayType={'text'} value={value}
    thousandSeparator={true} prefix={'$'} decimalScale={2}
    fixedDecimalScale={true} renderText={value => (
      <Text style={styles.tableCell}>{value}</Text>
    )}
  />
)
*/

export default ({ value }) => (
	<NumberFormat
		displayType={'text'} value={value}
		thousandSeparator={true} prefix={'₭ '} decimalScale={0}
		fixedDecimalScale={true} renderText={value => (
			<Text>{value}</Text>
		)}
	/>
)