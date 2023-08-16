import Spinner from '../../shared/Spinner';
import { Formik, Field, ErrorMessage } from 'formik';
import { CloseOutlined, UndoOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import FormWrapper, { tailFormItemLayout, formItemLayout } from '../../shared/styles/FormWrapper';
import { Button, Form, Input, Radio, Modal, Space } from 'antd';
import * as Yup from 'yup';
import InputFormItem from '../../shared/form/items/InputFormItem';
import ReactSelectFormItem from '../../shared/form/items/ReactSelectFormItem';
import axios from 'axios';
import TeamService from '../../modules/team/TeamServices.js';
import Message from '../../shared/message';
import ViewFormItem from '../../shared/form/items/ViewFormItem';

const config = {
  title: 'Team Name Error !',
  content: <div>Team name is already present !</div>,
};

class TeamForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sponsors_email: [],
    };
  }

  handleSubmit = async (values) => {
    const { isEditing } = this.props;
    const { team_id, team_name, team_category, team_short_name, sponsor_email_id, sponsor_player } = values;

    const data = {
      team_id,
      team_name,
      team_category,
      team_short_name,
      sponsor_email_id,
      sponsor_player,
    };

    if (isEditing) {
      await TeamService.update(data);
      Message.success('Team Updated Successfully');
      this.props.onCancel();
    } else {
      await TeamService.create(data);
      Message.success('Team Added Successfully');
      this.props.onCancel();
    }
  };

  initialValues = () => {
    const { isEditing, record } = this.props;
    if (isEditing) {
      const { team_id, team_name, team_category, team_short_name, sponsor_email_id, sponsor_player } = record;

      const data = {
        team_id,
        team_name,
        team_category,
        team_short_name,
        sponsor_email_id,
        sponsor_player,
      };
      return data;
    }
    return {};
  };

  renderForm() {
    const { ID, isEditing, record } = this.props;

    const TeamName =
      isEditing != true
        ? ID.map((item) => item.team_name.toLowerCase())
        : ID.filter((item) => item.team_name.toLowerCase() !== record.team_name.toLowerCase()).map((item) =>
            item.team_name.toLowerCase()
          );

    const TeamShortName =
      isEditing != true
        ? ID.map((item) => item.team_short_name.toLowerCase())
        : ID.filter((item) => item.team_short_name.toLowerCase() !== record.team_short_name.toLowerCase()).map((item) =>
            item.team_short_name.toLowerCase()
          );

    return (
      <FormWrapper>
        <Formik
          initialValues={this.initialValues()}
          onSubmit={this.handleSubmit}
          validationSchema={Yup.object().shape({
            team_category: Yup.number().required('Select Team Category'),
            team_name: Yup.string()
              .matches(/^[a-zA-Z_ ]+$/, 'Alphabets Only')
              .test(
                'existsTeamNameCheck',
                'Team name is already taken',
                (value) => (value !== undefined ? !TeamName.includes(value.toLowerCase()) : value)
              )
              .required('Team Name is Required'),
            team_short_name: Yup.string()
              .matches(/^[a-zA-Z_ ]+$/, 'Alphabets Only')
              .test(
                'existsCheck',
                'Team short name is already taken',
                (value) => (value !== undefined ? !TeamShortName.includes(value.toLowerCase()) : value)
              )
              .required('Team Short Name is Required'),
            sponsor_email_id: Yup.string().required('Select Sponsor Email ID'),
            sponsor_player: Yup.string()
              .matches(/^[a-zA-Z_ ]+$/, 'Alphabets and Number only')
              .required('Sponsor Player is Required'),
          })}>
          {(form) => {
            return (
              <Form onSubmit={form.handleSubmit}>
                <InputFormItem name={'team_name'} label={'Team Name'} />
                <InputFormItem name={'team_short_name'} label={'Team Short Name'} />
                <ReactSelectFormItem
                  name={'team_category'}
                  label={'Team Category'}
                  options={this.props.team_category_options}
                  placeholder={'Select Team Category'}
                />
                <ReactSelectFormItem
                  name={'sponsor_email_id'}
                  label={'Sponsor Email'}
                  options={this.props.sponsors_email}
                  placeholder={'Select Sponsor Email'}
                />
                <InputFormItem name={'sponsor_player'} label={'Sponsor Player'} />
                <Form.Item className="form-buttons" {...tailFormItemLayout}>
                  <Button type="primary" onClick={form.handleSubmit}>
                    {'Save'}
                  </Button>

                  <Button onClick={form.handleReset}>{'Reset'}</Button>

                  <Button onClick={() => this.props.onCancel()}>{'Close'}</Button>
                </Form.Item>
              </Form>
            );
          }}
        </Formik>
      </FormWrapper>
    );
  }

  render() {
    return this.renderForm();
  }
}

export default TeamForm;
