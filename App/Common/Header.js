/**
 * @flow
 */

import React from 'react';
import {
  View,
} from 'react-native';

import { StylesCommon } from '../Styles';
import VerticalDivider from "./VerticalDivider";

type Props = {
  left: ?any;
  center: ?any;
  right: ?any;
  style: ?Object;
};

export default function Header(props: Props) {
  const {
    left,
    center,
    right,
    style,
  } = props;

  return (
      <View>
          <View style={[StylesCommon.header, style]}>
              <View>
                  {left}
              </View>
              <View>
                  {center}
              </View>
              <View>
                  {right}
              </View>
          </View>
          <VerticalDivider />
      </View>
  );
}
