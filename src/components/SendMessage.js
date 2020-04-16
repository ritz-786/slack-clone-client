import React from 'react'
import styled from 'styled-components';
import { Input } from 'semantic-ui-react'
import { withFormik } from 'formik';
import {flowRight as compose} from 'lodash';

import {graphql } from '@apollo/react-hoc'
import gql from 'graphql-tag'

const SendMessageWrapper = styled.div`
	grid-column: 3;
	padding: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
	channelName,
	values,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting,
}) => (
	<SendMessageWrapper>
		<Input
			onKeyDown ={(e) => {
				if(e.keyCode === ENTER_KEY && !isSubmitting){
					handleSubmit(e);
				}
			}}
			onChange={handleChange}
			onBlur={handleBlur}
	        name="message"
	        value={values.message}
	        fluid
	        placeholder={`Message #${channelName}`}
		/>
	</SendMessageWrapper>
);

const createMessageMutation = gql`
	mutation($channelId: Int!,$text: String!){
		createMessage(channelId: $channelId, text: $text)
	}
`;
// Crisis is overhead⚡⚡⚡

export default compose(
	graphql(createMessageMutation),
	withFormik({
		mapPropsToValues: () => ({message: ''}),
		handleSubmit: async (values, {props: {channelId,mutate},setSubmitting, resetForm}) => {
			if(!values.message || !values.message.trim()){
				setSubmitting(false);
				return;
			}

			await mutate(
			{variables: {channelId , text: values.message},
			});
			window.location.reload(false);
			resetForm(false);
		},
	}),
)(SendMessage)