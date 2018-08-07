import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	finishButton: {
		backgroundColor: 'green',
	},
	interruptionItem: {
		flexDirection: 'column',
		paddingHorizontal: 5,
	},
	interruptionSubitem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	interruptionIconAndText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	productiveTimeText: {
		color: '#0005',
		marginLeft: 15,
		borderLeftWidth: 2,
		paddingLeft: 5,
		borderColor: '#0005',
	},
	buttonIcon: {
		color: 'white',
	},
});
