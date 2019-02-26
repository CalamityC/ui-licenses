import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { OrganizationSelection } from '@folio/stripes-erm-components';

const FILTERS = [
  'status',
  'type',
];

export default class LicenseFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
      type: [],
    }
  };

  state = {
    status: [],
    type: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = get(props.resources, [`${filter}Values`, 'records'], []);
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  createClearFilterHandler = (name) => () => {
    this.props.onChange({ name, values: [] });
  }

  renderCheckboxFilter = (name, props) => {
    const activeFilters = this.props.activeFilters[name] || [];

    return (
      <Accordion
        id={`filter-accordion-${name}`}
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id={`ui-licenses.prop.${name}`} />}
        onClearFilter={() => { this.props.onChange({ name, values: [] }); }}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={this.props.onChange}
          selectedValues={activeFilters}
        />
      </Accordion>
    );
  }

  renderOrganizationFilter = () => {
    const activeFilters = this.props.activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-licenses.agreements.organizations" />}
        onClearFilter={() => {
          this.props.onChange({ name: 'orgs', values: [] });
          this.props.onChange({ name: 'role', values: [] });
        }}
      >
        <OrganizationSelection
          path="licenses/org"
          input={{
            name: 'license-orgs-filter',
            onChange: value => this.props.onChange({ name: 'orgs', values: [value] }),
            value: activeFilters[0] || '',
          }}
        />
      </Accordion>
    );
  }

  renderRoleLabel = () => {
    const roles = get(this.props.resources.orgRoleValues, ['records'], []);
    const dataOptions = roles.map(role => ({
      value: role.id,
      label: role.label,
    }));

    const orgFilters = this.props.activeFilters.orgs || [];
    const activeFilters = this.props.activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.settings.orgRoles.orgRole" />}
        onClearFilter={() => { this.props.onChange({ name: 'role', values: [] }); }}
      >
        <Selection
          dataOptions={dataOptions}
          disabled={orgFilters.length === 0}
          value={activeFilters[0] || ''}
          onChange={value => this.props.onChange({ name: 'role', values: [value] })}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status')}
        {this.renderCheckboxFilter('type')}
        {this.renderOrganizationFilter()}
        {this.renderRoleLabel()}
      </AccordionSet>
    );
  }
}
