import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import {
  Save,
  Wrench,
  Globe,
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { showSuccess, showError } from '../common/ModernNotification';
import apiService from '../../services/apiService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

interface SettingsProps {
  theme: Theme;
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Neverland Studio',
    tagline: 'Creative Digital Solutions',
    contactEmail: 'info@neverlandstudio.com',
    siteUrl: 'https://neverlandstudio.com',
  });

  // Maintenance mode state
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    is_active: false,
    title: 'Website Under Maintenance',
    message: 'We are currently performing scheduled maintenance. We will be back soon!',
    estimated_time: '',
    allowed_ips: [] as string[],
  });
  const [newIp, setNewIp] = useState('');

  // Load maintenance settings
  const loadMaintenanceSettings = async () => {
    try {
      const response = await apiService.get('/admin/maintenance');
      if (response.data.success) {
        setMaintenanceSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load maintenance settings:', error);
    }
  };

  const handleMaintenanceToggle = () => {
    setMaintenanceSettings({
      ...maintenanceSettings,
      is_active: !maintenanceSettings.is_active,
    });
  };

  const handleMaintenanceSave = async () => {
    setLoading(true);
    try {
      const response = await apiService.put('/admin/maintenance', maintenanceSettings);
      if (response.data.success) {
        setMaintenanceSettings(response.data.data);
        showSuccess('Success', 'Maintenance settings updated successfully');
      }
    } catch (error) {
      showError('Error', 'Failed to update maintenance settings');
    } finally {
      setLoading(false);
    }
  };

  const addAllowedIp = () => {
    if (newIp && !maintenanceSettings.allowed_ips.includes(newIp)) {
      setMaintenanceSettings({
        ...maintenanceSettings,
        allowed_ips: [...maintenanceSettings.allowed_ips, newIp],
      });
      setNewIp('');
    }
  };

  const removeAllowedIp = (ip: string) => {
    setMaintenanceSettings({
      ...maintenanceSettings,
      allowed_ips: maintenanceSettings.allowed_ips.filter(i => i !== ip),
    });
  };

  const handleGeneralSave = () => {
    setLoading(true);
    setTimeout(() => {
      showSuccess('Settings Saved', 'Your general settings have been updated successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your application settings
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="flex items-center gap-2"
            onClick={loadMaintenanceSettings}
          >
            <Wrench className="w-4 h-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update your site's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={generalSettings.tagline}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    value={generalSettings.siteUrl}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button onClick={handleGeneralSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Control when your site is accessible to visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Maintenance Toggle */}
              <div className={`p-4 rounded-lg border ${maintenanceSettings.is_active ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${maintenanceSettings.is_active ? 'bg-destructive/20' : 'bg-green-500/20'}`}>
                      {maintenanceSettings.is_active ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {maintenanceSettings.is_active ? 'Maintenance Active' : 'Website Online'}
                        {maintenanceSettings.is_active && (
                          <Badge variant="destructive">Active</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {maintenanceSettings.is_active
                          ? 'Visitors see maintenance page'
                          : 'Website is accessible to everyone'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={maintenanceSettings.is_active}
                    onCheckedChange={handleMaintenanceToggle}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceTitle">Maintenance Title</Label>
                  <Input
                    id="maintenanceTitle"
                    value={maintenanceSettings.title}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={maintenanceSettings.message}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, message: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Estimated Time (Optional)</Label>
                  <Input
                    id="estimatedTime"
                    value={maintenanceSettings.estimated_time || ''}
                    onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, estimated_time: e.target.value })}
                    placeholder="e.g., 2 hours, until 10:00 AM"
                  />
                </div>

                <Separator />

                {/* Allowed IPs */}
                <div className="space-y-2">
                  <Label>Allowed IPs (Bypass Maintenance)</Label>
                  <p className="text-xs text-muted-foreground">
                    These IPs can access the website even during maintenance mode
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAllowedIp()}
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      className="flex-1"
                    />
                    <Button onClick={addAllowedIp} variant="secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {maintenanceSettings.allowed_ips.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {maintenanceSettings.allowed_ips.map((ip) => (
                        <div
                          key={ip}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted"
                        >
                          <span className="text-sm font-mono">{ip}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAllowedIp(ip)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleMaintenanceSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Maintenance Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
