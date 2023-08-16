import { Formik, Field, ErrorMessage } from "formik";
import React, { Component } from "react";
import FormWrapper, {
  tailFormItemLayout,
  formItemLayout
} from "../../../shared/styles/FormWrapper";
import { Button, Form, Input, Radio } from "antd";
import * as Yup from "yup";
import moment from "moment";
import InputFormItem from "../../../shared/form/items/InputFormItem";
import DatePickerRangeFormItem from "../../../shared/form/items/DatePickerRangeFormItem";
import TextAreaFormItem from "../../../shared/form/items/TextAreaFormItem";

class TournamentForm extends Component {
  handleSubmit = (values, {resetForm}) => {
    const { record, isEditing } = this.props;
    const { date, tournament_name, tournament_desc } = values;
    const StartDate = moment.utc(date[0].toLocaleString()).format("YYYY-MM-DD");
    const EndDate = moment.utc(date[1].toLocaleString()).format("YYYY-MM-DD");

    if (isEditing) {
      const tournament_id = record.tournament_id;
      const data = {
        tournament_id,
        tournament_name,
        StartDate,
        EndDate,
        tournament_desc
      };
      this.props.onSubmit(data);
      resetForm({values: ''});
    } else {
      const data = { tournament_name, StartDate, EndDate, tournament_desc };
      this.props.onSubmit(data);
      resetForm({values: ''});
    }
  };

  initialValues = () => {
    const { isEditing, record } = this.props;

    if (isEditing) {
      var startDate_moment = moment(record.StartDate);
      var endDate_moment = moment(record.EndDate);

      const data = {
        tournament_name: record.tournament_name,
        tournament_desc: record.tournament_desc,
        date: [
          startDate_moment.local(),
          endDate_moment.local()
        ]
      };
      return data;
    }
    return {};
  };

  renderForm() {
    const { saveLoading, isEditing } = this.props;
    return (
      <FormWrapper>
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={this.initialValues()}
          validationSchema={Yup.object().shape({
            tournament_name: Yup.string()
              .matches(/^[a-zA-Z0-9_ ]+$/, "Alphabets and Number only")
              .required("Tournament Name is Required"),
            date: Yup.string()
              .required("Required")
              .nullable(),
            tournament_desc: Yup.string().nullable()
          })}
          enableReinitialize
        >
          {form => {
            return (
              <Form onSubmit={form.handleSubmit}>
                <InputFormItem name={"tournament_name"} label={"Name"} />
                <TextAreaFormItem
                  name={"tournament_desc"}
                  label={"Description"}
                />
                <DatePickerRangeFormItem
                  name={"date"}
                  label={"Date"}
                  layout={formItemLayout}
                  format={"DD-MM-YYYY"}
                  disabledDate={current => {
                    return current && current < moment();
                  }}
                />
                <Form.Item className="form-buttons" {...tailFormItemLayout}>
                  <Button
                    loading={saveLoading}
                    type="primary"
                    onClick={form.handleSubmit}
                  >
                    {"Save"}
                  </Button>

                  <Button disabled={saveLoading} onClick={form.handleReset}>
                    {"Reset"}
                  </Button>

                  {this.props.onCancel ? (
                    <Button
                      disabled={saveLoading}
                      onClick={() => {
                        form.resetForm();
                        this.props.onCancel();
                      }}
                    >
                      {"Close"}
                    </Button>
                  ) : null}
                </Form.Item>
              </Form>
            );
          }}
        </Formik>
      </FormWrapper>
    );
  }
  render() {
    const { isEditing, findLoading, record } = this.props;
    if (findLoading) {
      return <Spinner />;
    }

    if (isEditing && !record) {
      return <Spinner />;
    }

    return this.renderForm();
  }
}
export default TournamentForm;
