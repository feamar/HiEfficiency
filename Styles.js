import React from 'react';
import { StyleSheet } from 'react-native';

const colors = {
  jet: '#353535',
  myrtleGreen: '#3c6e71',
  myrtleGreenTint: '#afd2d4',
  gainsboro: '#d9d9d9',
  darkSlateGrey: '#284b63',
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'white',
  },
  text: {
    color: colors.jet,
  },
  /*------------------ Story overview ------------------*/
  storyOverviewItem: {
    paddingLeft: 5,
    marginVertical: 1,
    marginLeft: 2,
    borderLeftWidth: 8,
  },
  storyOpen: {
    borderColor: colors.myrtleGreen,
  },
  storyFinished: {
    borderColor: colors.myrtleGreenTint,
  },
  /*------------------ Interruption list ------------------*/
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
		color: colors.gainsboro,
		marginLeft: 15,
		borderLeftWidth: 2,
		paddingLeft: 5,
		borderColor: colors.gainsboro,
	},
  /*------------------ Buttons ------------------*/
  buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	finishButton: {
		backgroundColor: 'green',
	},
	buttonIcon: {
		color: 'white',
	},
  storiesButton: {
    backgroundColor: colors.myrtleGreen,
  },
  profileButton: {
    backgroundColor: colors.darkSlateGrey,
  },
  /*------------------ Modal ------------------*/
  modalSurroundings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000033',
  },
  modalContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    padding: 5,
    justifyContent: 'flex-start',
  },
  modalHeader: {
    backgroundColor: colors.darkSlateGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datetimeEditButton: {
    flex: .8,
    paddingVertical: 2,
    borderColor: colors.gainsboro,
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
});
