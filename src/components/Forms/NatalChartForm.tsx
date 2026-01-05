import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useChartForm } from '@/lib/hooks/useChartForm';
import { houseSystemDescriptions } from '@/lib/schemas/chart';
import LocationSection from '@/components/Organisms/BirthLocation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Button } from '@/components/ThirdParty/ShadCn/Button';
import { Badge } from '@/components/ThirdParty/ShadCn/Badge';
import { StarIcon, ClockIcon, UserIcon } from 'lucide-react';

type FormValues = {
  pageFormData: {
    date: string;
    name: string;
    time: string;
    timeKnown: boolean;
    location: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: number;
      longitude?: number;
      knowsCoordinates?: boolean;
      timezone?: string;
    };
    houseSystem: string;
    gender?: string;
    orbPreferences?: Record<string, unknown>;
    notes?: string;
  };
};

interface NatalChartFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
}

const NatalChartForm: React.FC<NatalChartFormProps> = ({ onSubmit, isLoading = false }) => {
  const methods = useChartForm();
  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = methods;

  const timeKnown = watch('pageFormData.timeKnown');
  const houseSystem = watch('pageFormData.houseSystem');

  React.useEffect(() => {
    if (!timeKnown) {
      setValue('pageFormData.time', '12:00', { shouldValidate: true });
    }
  }, [timeKnown, setValue]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic details for your astrological reading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  {...register('pageFormData.name')}
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.pageFormData?.name && (
                  <p className="text-sm text-red-600">{errors.pageFormData.name.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender (Optional)
                </label>
                <select
                  {...register('pageFormData.gender')}
                  id="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <ClockIcon className="w-5 h-5" />
              Date & Time
            </CardTitle>
            <CardDescription>
              Precise timing is crucial for accurate astrological calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  {...register('pageFormData.date')}
                  type="date"
                  id="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.pageFormData?.date && (
                  <p className="text-sm text-red-600">{errors.pageFormData.date.message}</p>
                )}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Time *
                </label>
                <input
                  {...register('pageFormData.time')}
                  type="time"
                  id="time"
                  disabled={!timeKnown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.pageFormData?.time && (
                  <p className="text-sm text-red-600">{errors.pageFormData.time.message}</p>
                )}
              </div>
            </div>

            {/* Time Known Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                {...register('pageFormData.timeKnown')}
                type="checkbox"
                id="timeKnown"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="timeKnown" className="text-sm text-gray-700">
                I know my exact birth time
              </label>
            </div>

            {!timeKnown && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Without an exact birth time, we'll use 12:00 PM (noon) as default. 
                  This will affect the accuracy of house placements and the Ascendant/Midheaven calculations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Section */}
        <LocationSection prefix="pageFormData.location" />

        {/* Chart Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <StarIcon className="w-5 h-5" />
              Chart Calculation Preferences
            </CardTitle>
            <CardDescription>
              Advanced settings for astrological calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* House System */}
            <div className="space-y-2">
              <label htmlFor="houseSystem" className="text-sm font-medium text-gray-700">
                House System
              </label>
              <select
                {...register('pageFormData.houseSystem')}
                id="houseSystem"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(houseSystemDescriptions).map(([system]) => (
                  <option key={system} value={system}>
                    {system.charAt(0).toUpperCase() + system.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              {houseSystem && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>{houseSystem.charAt(0).toUpperCase() + houseSystem.slice(1).replace('-', ' ')}:</strong> {' '}
                    {houseSystemDescriptions[houseSystem as keyof typeof houseSystemDescriptions]}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('pageFormData.notes')}
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Any additional context or questions about your birth chart..."
              />
              {errors.pageFormData?.notes && (
                <p className="text-sm text-red-600">{errors.pageFormData.notes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                <Badge variant="outline" className="mr-2">
                  {isValid ? '✓' : '✗'}
                </Badge>
                Form validation: {isValid ? 'Complete' : 'Incomplete'}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!isValid || isLoading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <StarIcon className="w-4 h-4 mr-2" />
                    Generate Birth Chart
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};

export default NatalChartForm;
