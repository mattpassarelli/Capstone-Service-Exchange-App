import React from 'react';
import { Text, TouchableOpacity, ViewPropTypes } from "react-native"
import PropTypes from 'prop-types'

class CustomButton extends React.Component {
    render() {
        const { text, onPress, buttonStyle, textStyle, disabled } = this.props

        return (
            <TouchableOpacity style={buttonStyle}
                onPress={() => onPress()} disabled={disabled}>
                <Text style={textStyle}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    buttonStyle: ViewPropTypes.style,
    textStyle: ViewPropTypes.style,
    disabled: PropTypes.bool
}


export default CustomButton