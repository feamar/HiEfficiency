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
  modalSurroundings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000033',
  },
  modalContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#ffffffff',
    padding: 5,
    justifyContent: 'flex-start',
  },
  modalHeader: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datetimeEditButton: {
    flex: .8,
    paddingVertical: 2,
    borderColor: 'grey',
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
});
