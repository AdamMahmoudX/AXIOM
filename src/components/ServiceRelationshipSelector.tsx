// =====================================================
// SERVICE RELATIONSHIP SELECTOR - AXIOMX ADMIN SYSTEM
// Phase 5E-2: Service Relationship Validation
// =====================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useServices, RelationshipValidationError } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, Plus, Link2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ServiceRelationshipSelectorProps {
  selectedServiceIds: string[];
  onChange: (selectedIds: string[]) => void;
  currentServiceId?: string;
  excludeServiceIds?: string[];
  onValidationChange?: (isValid: boolean, errorCount: number, errors: RelationshipValidationError[]) => void;
}

const ServiceRelationshipSelector: React.FC<ServiceRelationshipSelectorProps> = ({
  selectedServiceIds,
  onChange,
  currentServiceId,
  excludeServiceIds = [],
  onValidationChange,
}) => {
  const { language } = useLanguage();
  const { getAvailableRelatedServices, getService, validateRelationships } = useServices();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Validate relationships and report changes
  const validationResult = useMemo(() => {
    return validateRelationships(selectedServiceIds, currentServiceId, language);
  }, [selectedServiceIds, currentServiceId, language, validateRelationships]);

  // Report validation changes to parent
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(
        validationResult.isValid,
        validationResult.errorCount,
        validationResult.errors
      );
    }
  }, [validationResult, onValidationChange]);

  // Get available services (exclude current service and already selected)
  const availableServices = useMemo(() => {
    const services = getAvailableRelatedServices(currentServiceId || '');

    // Filter out excluded services
    const filtered = services.filter(
      (service) => !excludeServiceIds.includes(service.id)
    );

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.shortDescription.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [getAvailableRelatedServices, currentServiceId, excludeServiceIds, searchQuery]);

  // Get selected service objects
  const selectedServices = useMemo(() => {
    return selectedServiceIds
      .map((id) => getService(id))
      .filter((service): service is NonNullable<typeof service> => service !== undefined);
  }, [selectedServiceIds, getService]);

  // Handle adding a service
  const handleAddService = (serviceId: string) => {
    // Prevent duplicates
    if (selectedServiceIds.includes(serviceId)) return;

    // Prevent self-reference
    if (serviceId === currentServiceId) return;

    onChange([...selectedServiceIds, serviceId]);
    setSearchQuery('');
  };

  // Handle removing a service
  const handleRemoveService = (serviceId: string) => {
    onChange(selectedServiceIds.filter((id) => id !== serviceId));
  };

  // Check if a service is already selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServiceIds.includes(serviceId) || serviceId === currentServiceId;
  };

  return (
    <div className="space-y-4">
      {/* Header with Validation Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-400" />
          <label className="text-sm font-medium text-gray-400">
            {language === 'ar' ? 'الخدمات المرتبطة' : 'Related Services'}
          </label>
        </div>
        <div className="flex items-center gap-2">
          {validationResult.errorCount > 0 ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs">
              <AlertTriangle className="w-3 h-3" />
              {language === 'ar'
                ? `${validationResult.errorCount} خطأ`
                : `${validationResult.errorCount} error(s)`}
            </span>
          ) : selectedServiceIds.length > 0 ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs">
              <CheckCircle className="w-3 h-3" />
              {language === 'ar' ? 'صالح' : 'Valid'}
            </span>
          ) : null}
          <span className="text-xs text-gray-500">
            {language === 'ar'
              ? `${selectedServiceIds.length} خدمة`
              : `${selectedServiceIds.length} service(s)`}
          </span>
        </div>
      </div>

      {/* Validation Errors Display */}
      {validationResult.errorCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-2">
          {validationResult.errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 text-red-400 text-xs">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Services Display */}
      {selectedServices.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            {language === 'ar' ? 'الخدمات المختارة:' : 'Selected Services:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg"
              >
                <span className="text-blue-400 text-sm font-medium">
                  {service.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveService(service.id)}
                  className="w-4 h-4 rounded-full bg-blue-500/30 hover:bg-blue-500/50 flex items-center justify-center transition-colors"
                  title={language === 'ar' ? 'إزالة' : 'Remove'}
                >
                  <X className="w-3 h-3 text-blue-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Dropdown */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={
              language === 'ar'
                ? 'ابحث عن خدمة لإضافتها...'
                : 'Search for a service to add...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {availableServices.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {language === 'ar'
                  ? 'لا توجد خدمات متاحة'
                  : 'No services available'}
              </div>
            ) : (
              <div className="py-2">
                {availableServices.map((service) => {
                  const isSelected = isServiceSelected(service.id);
                  const isAlreadySelected = selectedServiceIds.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      disabled={isSelected}
                      onClick={() => {
                        if (!isAlreadySelected && !isSelected) {
                          handleAddService(service.id);
                        }
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                        isSelected
                          ? 'opacity-50 cursor-not-allowed bg-white/5'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Link2 className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {service.title}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {service.category}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs">
                            {language === 'ar' ? '✓' : '✓'}
                          </span>
                        </div>
                      )}
                      {!isSelected && (
                        <Plus className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        {language === 'ar'
          ? 'اختر الخدمات المرتبطة بهذه الخدمة. لا يمكن ربط الخدمة بنفسها.'
          : 'Select related services for this service. Cannot link a service to itself.'}
      </p>
    </div>
  );
};

export default ServiceRelationshipSelector;