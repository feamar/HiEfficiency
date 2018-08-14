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
  textDark: {
    color: colors.jet,
  },
  profile: {
    backgroundColor: colors.darkSlateGrey,
  },
  stories: {
    backgroundColor: colors.myrtleGreen,
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
  interruptionList: {
    marginHorizontal: 10,
    justifyContent: 'flex-start',
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
		flexDirection: 'row',
		justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
	},
  moreButton: {
    paddingHorizontal: 8,
    color: colors.myrtleGreen,
  },
	buttonIcon: {
		color: 'white',
	},
  finishButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.myrtleGreen,
    marginBottom: 5,
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
    justifyContent: 'space-between',
  },
  modalHeader: {
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
