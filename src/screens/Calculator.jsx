import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const CalculatorScreen = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [memory, setMemory] = useState(0);
    const [memoryLog, setMemoryLog] = useState([]);
    const [hasResult, setHasResult] = useState(false);

    // Calculate the current result of expression dynamically
    const getCurrentResult = () => {
        if (!expression) return '';
        
        // Check if expression ends with an operator
        const lastChar = expression.slice(-1);
        const isOperatorAtEnd = ['+', '-', '*', '/', '×', '÷'].includes(lastChar);
        
        try {
            let evalExpression;
            if (isOperatorAtEnd) {
                // If ends with operator, evaluate without the operator to show previous result
                evalExpression = expression.slice(0, -1).replace(/×/g, '*').replace(/÷/g, '/');
            } else {
                // Normal evaluation
                evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            }
            
            const result = eval(evalExpression);
            if (!isNaN(result) && isFinite(result)) {
                return ` = ${result}`;
            }
        } catch (err) {
            // If can't calculate, don't show result
        }
        return '';
    };

    const handlePress = (val) => {
        if (hasResult && !['+', '-', '*', '/', '×', '÷'].includes(val)) {
            // If we have a result and user presses a number, start fresh
            setExpression(val);
            setDisplay(val);
            setHasResult(false);
            return;
        }

        if (val === '=') {
            try {
                if (!expression) return;

                // Replace × and ÷ with * and / for evaluation
                const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
                const result = eval(evalExpression);

                if (isNaN(result) || !isFinite(result)) {
                    setDisplay('Error');
                    setExpression('');
                    return;
                }

                // Just show the result, don't modify expression
                setDisplay(result.toString());
                setHasResult(true);
            } catch (err) {
                setDisplay('Error');
                setExpression('');
            }
        } else if (['+', '-', '*', '/', '×', '÷'].includes(val)) {
            if (hasResult) {
                // Start new calculation with the result
                setExpression(display + val);
                setDisplay(display);
                setHasResult(false);
            } else if (expression) {
                // Check if last character is already an operator
                const lastChar = expression.slice(-1);
                if (['+', '-', '*', '/', '×', '÷'].includes(lastChar)) {
                    // Replace the last operator
                    setExpression(expression.slice(0, -1) + val);
                } else {
                    // Calculate current result and show it in display
                    try {
                        const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
                        const result = eval(evalExpression);
                        
                        if (!isNaN(result) && isFinite(result)) {
                            // Add operator to expression and show result in display
                            setExpression(expression + val);
                            setDisplay(result.toString());
                        } else {
                            // If can't calculate, just add operator
                            setExpression(expression + val);
                        }
                    } catch (err) {
                        // If error in calculation, just add operator
                        setExpression(expression + val);
                    }
                }
            } else {
                // First operator, use current display
                setExpression(display + val);
                setDisplay(display);
            }
        } else {
            // Number or decimal point
            if (hasResult) {
                // Start fresh calculation
                setExpression(val);
                setDisplay(val);
                setHasResult(false);
            } else {
                const lastChar = expression.slice(-1);
                if (['+', '-', '*', '/', '×', '÷'].includes(lastChar)) {
                    // After operator, start new number
                    setExpression(expression + val);
                    setDisplay(val);
                } else {
                    // Continue current number
                    const newExpression = expression + val;
                    setExpression(newExpression);
                    setDisplay(display === '0' && val !== '.' ? val : display + val);
                }
            }
        }
    };

    const handleClear = () => {
        setExpression('');
        setDisplay('0');
        setHasResult(false);
        handleMemory('MC');
    };

    const handleBackspace = () => {
        if (hasResult) {
            handleClear();
            return;
        }

        if (expression.length <= 1) {
            setExpression('');
            setDisplay('0');
        } else {
            const newExpression = expression.slice(0, -1);
            setExpression(newExpression);

            // Update display based on the last part of expression
            const lastChar = newExpression.slice(-1);
            if (['+', '-', '*', '/', '×', '÷'].includes(lastChar)) {
                // If last char is operator, calculate and show result
                try {
                    const evalExpression = newExpression.slice(0, -1).replace(/×/g, '*').replace(/÷/g, '/');
                    const result = eval(evalExpression);
                    if (!isNaN(result) && isFinite(result)) {
                        setDisplay(result.toString());
                    } else {
                        setDisplay('0');
                    }
                } catch (err) {
                    setDisplay('0');
                }
            } else {
                // Extract the current number being typed
                const parts = newExpression.split(/[+\-*/×÷]/);
                const lastPart = parts[parts.length - 1];
                setDisplay(lastPart || '0');
            }
        }
    };

    const handleMemory = (type) => {
        try {
            const currentValue = parseFloat(display || '0');
            const timestamp = new Date().toLocaleTimeString();

            if (isNaN(currentValue)) {
                setDisplay('Error');
                return;
            }

            if (type === 'M+') {
                const newMemory = memory + currentValue;
                setMemory(newMemory);
                setMemoryLog((prev) => [`${timestamp}: M+(${currentValue}) = ${newMemory}`, ...prev.slice(0, 9)]);
                // Clear display after M+ operation
                setDisplay('0');
                setExpression('');
                setHasResult(false);
            } else if (type === 'M-') {
                const newMemory = memory - currentValue;
                setMemory(newMemory);
                setMemoryLog((prev) => [`${timestamp}: M-(${currentValue}) = ${newMemory}`, ...prev.slice(0, 9)]);
                // Clear display after M- operation
                setDisplay('0');
                setExpression('');
                setHasResult(false);
            } else if (type === 'MRC') {
                setDisplay(memory.toString());
                setExpression(memory.toString());
                setHasResult(true);
            } else if (type === 'SAVE') {
                // Save current display value to memory
                setMemory(currentValue);
                setMemoryLog((prev) => [`${timestamp}: Saved ${currentValue}`, ...prev.slice(0, 9)]);
                // Clear display after save operation
                setDisplay('0');
                setExpression('');
                setHasResult(false);
            } else if (type === 'MC') {
                setMemory(0);
                setMemoryLog([]);
            }
        } catch (err) {
            setDisplay('Error');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#388e3c" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>You have got ₹{memory} from Suman Dey</Text>
            </View>

            {/* Display Area */}
            <View style={styles.displayContainer}>
                <Text style={styles.displayText} numberOfLines={1}>
                    {display}
                </Text>
            </View>

            {/* Memory Section */}
            {(memory !== 0 || memoryLog.length > 0 || expression) && (
                <View style={styles.memorySection}>
                    {expression && (
                        <View style={styles.currentCalculation}>
                            <Text style={styles.expressionText} numberOfLines={2}>
                                {expression + getCurrentResult()}
                            </Text>
                        </View>
                    )}

                    {memoryLog.length > 0 && (
                        <View style={styles.memoryHeader}>
                            <Text style={styles.memoryTitle}>Memory: ₹{memory}</Text>
                        </View>
                    )}

                    {memoryLog.length > 0 && (
                        <ScrollView style={styles.memoryLog} showsVerticalScrollIndicator={false}>
                            {memoryLog.map((entry, index) => (
                                <Text key={index} style={styles.memoryEntry}>{entry}</Text>
                            ))}
                        </ScrollView>
                    )}
                </View>
            )}

            {/* Button Grid */}
            <View style={styles.buttonGrid}>
                {/* MRC/Save button - Full width */}
                <View style={styles.row}>
                    <CalcButton
                        label={memory !== 0 && display !== memory.toString() ? `MRC = ${memory}` : 'Save'}
                        onPress={() => handleMemory(memory !== 0 && display !== memory.toString() ? 'MRC' : 'SAVE')}
                        type="memory"
                        fullWidth
                    />
                </View>

                {/* First row - Clear, Memory operations */}
                <View style={styles.row}>
                    <CalcButton label="C" onPress={handleClear} type="clear" />
                    <CalcButton label="M+" onPress={() => handleMemory('M+')} type="memory" />
                    <CalcButton label="M-" onPress={() => handleMemory('M-')} type="memory" />
                    <CalcButton label="÷" onPress={() => handlePress('÷')} type="operator" />
                </View>

                {/* Number and operator rows */}
                {[
                    ['7', '8', '9', '×'],
                    ['4', '5', '6', '-'],
                    ['1', '2', '3', '+'],
                    ['0', '.', '=', '⌫'],
                ].map((row, i) => (
                    <View style={styles.row} key={i}>
                        {row.map((val) => (
                            <CalcButton
                                key={val}
                                label={val}
                                onPress={
                                    val === '⌫' ? handleBackspace :
                                        () => handlePress(val)
                                }
                                type={
                                    ['÷', '×', '-', '+'].includes(val) ? 'operator' :
                                        val === '=' ? 'equals' :
                                            val === '⌫' ? 'backspace' :
                                                val === '0' ? 'zero' : 'number'
                                }
                            />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const CalcButton = ({ label, onPress, type, fullWidth }) => {
    const getButtonStyle = () => {
        switch (type) {
            case 'operator':
                return [styles.button, styles.operatorButton, fullWidth && styles.fullWidthButton];
            case 'equals':
                return [styles.button, styles.equalsButton, fullWidth && styles.fullWidthButton];
            case 'clear':
                return [styles.button, styles.clearButton];
            case 'memory':
                return [styles.button, styles.memoryButton];
            case 'backspace':
                return [styles.button, styles.backspaceButton];
            case 'zero':
                return [styles.button, styles.zeroButton];
            default:
                return [styles.button, styles.numberButton];
        }
    };

    const getTextStyle = () => {
        switch (type) {
            case 'operator':
            case 'equals':
            case 'clear':
            case 'memory':
            case 'backspace':
                return [styles.buttonText, styles.whiteText];
            default:
                return [styles.buttonText, styles.darkText];
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={getButtonStyle()}
            activeOpacity={0.7}
        >
            <Text style={getTextStyle()}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default CalculatorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#388e3c',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
    },
    displayContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        minHeight: 120,
        justifyContent: 'flex-end',
    },
    expressionText: {
        fontSize: 16,
        color: '#2c3e50',
        textAlign: 'left',
        marginBottom: 8,
        fontWeight: '500',
    },
    currentCalculation: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    currentCalculationLabel: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    historySection: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    historyLabel: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    historyLog: {
        maxHeight: 120,
    },
    historyEntry: {
        fontSize: 14,
        color: '#388e3c',
        marginBottom: 4,
        fontWeight: '500',
    },
    displayText: {
        fontSize: 36,
        fontWeight: '300',
        color: '#2c3e50',
        textAlign: 'right',
    },
    memorySection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    memoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    memoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    clearMemoryBtn: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    clearMemoryText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    memoryLog: {
        maxHeight: 80,
    },
    memoryEntry: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 4,
    },
    buttonGrid: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    button: {
        flex: 1,
        marginHorizontal: 6,
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    fullWidthButton: {
        flex: 4,
        marginHorizontal: 6,
    },
    numberButton: {
        backgroundColor: '#ffffff',
    },
    operatorButton: {
        backgroundColor: '#007bff',
    },
    equalsButton: {
        backgroundColor: '#28a745',
    },
    clearButton: {
        backgroundColor: '#dc3545',
    },
    memoryButton: {
        backgroundColor: '#6f42c1',
    },
    backspaceButton: {
        backgroundColor: '#fd7e14',
    },
    zeroButton: {
        backgroundColor: '#ffffff',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
    },
    whiteText: {
        color: '#ffffff',
    },
    darkText: {
        color: '#2c3e50',
    },
});
