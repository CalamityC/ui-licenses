import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { OrganizationCard } from '@folio/stripes-erm-components';
import { Accordion, Badge, Icon, Layout } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

export default class LicenseOrganizations extends React.Component {
  static propTypes = {
    license: PropTypes.shape({
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string.isRequired,
            vendorsUuid: PropTypes.string,
          }).isRequired,
          role: PropTypes.shape({
            label: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }).isRequired,
  };

  renderOrgList = (orgs) => {
    return orgs.map(o => {
      const { interfaces, org, role } = o;
      if (!org || !role) return null;

      return (
        <OrganizationCard
          data-test-license-org
          key={`${org.orgsUuid}-${role.value}`}
          cardStyle="positive"
          headerStart={
            <span>
              <AppIcon
                app="licenses"
                size="small"
              />
              &nbsp;
              <Link to={`/organizations/view/${org.orgsUuid}`}>
                {org.name}
              </Link>
              {` · ${role.label}`}
            </span>
          }
          interfaces={interfaces}
        />
      );
    });
  }

  renderOrganizations = () => {
    const { orgs } = this.props.license;

    if (!orgs || !orgs.length) return <FormattedMessage id="ui-licenses.organizations.licenseHasNone" />;

    return this.renderOrgList(orgs);
  }

  renderBadge = () => {
    const count = get(this.props.license, ['orgs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    return (
      <Accordion
        closedByDefault
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id="license-orgs"
        label={<FormattedMessage id="ui-licenses.section.organizations" />}
      >
        <Layout className="padding-bottom-gutter">
          {this.renderOrganizations()}
        </Layout>
      </Accordion>
    );
  }
}
