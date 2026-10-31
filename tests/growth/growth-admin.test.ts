import { describe, it, expect } from 'vitest';
import { GrowthAdminService } from '../../growth/admin/growth-admin-service.js';
import { GROWTH_CONFIG } from '../../growth/config/growth-config.js';

describe('Acceptance Tests 25-26: Private Growth Dashboard & Administrative Authorization', () => {
  const adminService = new GrowthAdminService();

  it('Test 25: Private dashboard requires valid authentication token', async () => {
    // Missing token
    await expect(adminService.getDashboardOverview('')).rejects.toThrow(/Unauthorized/);

    // Invalid token
    await expect(adminService.getDashboardOverview('invalid-secret-token')).rejects.toThrow(/Unauthorized/);

    // Valid token
    const overview = await adminService.getDashboardOverview(GROWTH_CONFIG.admin.adminToken);
    expect(overview.status).toBe('healthy');
    expect(overview.auth?.role).toBe('admin');
    expect(overview.metrics).toBeDefined();
    expect(overview.sections).toBeDefined();
  });

  it('Test 26: Unauthorized administrative actions fail', () => {
    expect(() => {
      adminService.approveDistribution('any-job-id', 'bad-token');
    }).toThrow(/Forbidden|Unauthorized/);

    expect(() => {
      adminService.runFullSEOAudit('bad-token');
    }).toThrow(/Forbidden|Unauthorized/);
  });
});
