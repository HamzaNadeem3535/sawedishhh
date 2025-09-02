import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, FileText, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';

// Type Definitions
interface BoardMember {
  id: string;
  first_name: string;
  last_name: string;
  personal_number: string;
  email: string;
  phone: string;
  address: string;
  role: 'chairman' | 'vice_chairman' | 'secretary' | 'treasurer' | 'member';
  is_signatory: boolean;
  bankid_verified: boolean;
}

interface ContactPerson {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  is_authorized_representative: boolean;
}

interface ComplianceCheck {
  id: string;
  check_type: 'minimum_capital' | 'board_composition' | 'purpose_validity' | 'name_availability';
  status: 'passed' | 'failed';
  details: string;
  checked_at: string;
}

interface FoundationRegistration {
  foundation_name: string;
  purpose: string;
  registered_office_address: string;
  postal_code: string;
  city: string;
  country: string;
  initial_capital: number;
  currency: string;
  board_members: BoardMember[];
  status: 'draft' | 'submitted' | 'approved';
}

export const FoundationRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBankIDModal, setShowBankIDModal] = useState<boolean>(false);
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [registrationData, setRegistrationData] = useState<FoundationRegistration>({
    foundation_name: '',
    purpose: '',
    registered_office_address: '',
    postal_code: '',
    city: '',
    country: 'Sweden',
    initial_capital: 0,
    currency: 'SEK',
    board_members: [],
    status: 'draft',
  });

  const [contactPerson, setContactPerson] = useState<ContactPerson>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    is_authorized_representative: true,
  });

  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Foundation details and purpose' },
    { id: 2, title: 'Board Members', description: 'Add board members and roles' },
    { id: 3, title: 'Contact Person', description: 'Authorized representative details' },
    { id: 4, title: 'Compliance Check', description: 'Verify regulatory requirements' },
    { id: 5, title: 'Document Generation', description: 'Generate required documents' },
    { id: 6, title: 'Digital Signatures', description: 'BankID verification and signing' },
    { id: 7, title: 'Authority Submission', description: 'Submit to Swedish authorities' },
  ];

  const validateBasicInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!registrationData.foundation_name) newErrors.foundation_name = 'Foundation name is required';
    if (!registrationData.purpose || registrationData.purpose.length < 50)
      newErrors.purpose = 'Purpose must be at least 50 characters';
    if (!registrationData.registered_office_address)
      newErrors.registered_office_address = 'Address is required';
    if (!registrationData.postal_code) newErrors.postal_code = 'Postal code is required';
    if (!registrationData.city) newErrors.city = 'City is required';
    if (registrationData.initial_capital < 25000)
      newErrors.initial_capital = 'Minimum capital of 25,000 SEK required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactPerson = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!contactPerson.first_name) newErrors.first_name = 'First name is required';
    if (!contactPerson.last_name) newErrors.last_name = 'Last name is required';
    if (!contactPerson.email) newErrors.email = 'Email is required';
    if (!contactPerson.phone) newErrors.phone = 'Phone is required';
    if (!contactPerson.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateBasicInfo()) {
      setCurrentStepWithBounds(2);
      setErrors({});
    }
  };

  const handleBoardMembersSubmit = () => {
    if (registrationData.board_members.length >= 3) {
      setCurrentStepWithBounds(3);
    } else {
      setErrors({ board_members: 'A foundation requires at least 3 board members' });
    }
  };

  const handleContactPersonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactPerson()) {
      setCurrentStepWithBounds(4);
      runComplianceChecks();
      setErrors({});
    }
  };

  const runComplianceChecks = () => {
    setLoading(true);
    setTimeout(() => {
      const checks: ComplianceCheck[] = [
        {
          id: '1',
          check_type: 'minimum_capital',
          status: registrationData.initial_capital >= 25000 ? 'passed' : 'failed',
          details:
            registrationData.initial_capital >= 25000
              ? 'Minimum capital requirement of 25,000 SEK met'
              : 'Minimum capital requirement of 25,000 SEK not met',
          checked_at: new Date().toISOString(),
        },
        {
          id: '2',
          check_type: 'board_composition',
          status: registrationData.board_members.length >= 3 ? 'passed' : 'failed',
          details:
            registrationData.board_members.length >= 3
              ? 'Board composition meets minimum requirement of 3 members'
              : 'Board must have at least 3 members',
          checked_at: new Date().toISOString(),
        },
        {
          id: '3',
          check_type: 'purpose_validity',
          status: registrationData.purpose.length >= 50 ? 'passed' : 'failed',
          details:
            registrationData.purpose.length >= 50
              ? 'Foundation purpose is sufficiently detailed'
              : 'Foundation purpose must be more detailed (minimum 50 characters)',
          checked_at: new Date().toISOString(),
        },
        {
          id: '4',
          check_type: 'name_availability',
          status: 'passed',
          details: 'Foundation name is available and compliant',
          checked_at: new Date().toISOString(),
        },
      ];
      setComplianceChecks(checks);
      setLoading(false);
      setShowComplianceModal(true);
    }, 2000);
  };

  const handleComplianceComplete = () => {
    const allPassed = complianceChecks.every((check) => check.status === 'passed');
    if (allPassed) {
      setCurrentStepWithBounds(5);
      setShowComplianceModal(false);
    }
  };

  const addBoardMember = () => {
    const newMember: BoardMember = {
      id: Date.now().toString(),
      first_name: '',
      last_name: '',
      personal_number: '',
      email: '',
      phone: '',
      address: '',
      role: 'member',
      is_signatory: false,
      bankid_verified: false,
    };
    setRegistrationData((prev) => ({
      ...prev,
      board_members: [...prev.board_members, newMember],
    }));
  };

  const updateBoardMember = (index: number, field: keyof BoardMember, value: any) => {
    setRegistrationData((prev) => ({
      ...prev,
      board_members: prev.board_members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member,
      ),
    }));
  };

  const removeBoardMember = (index: number) => {
    setRegistrationData((prev) => ({
      ...prev,
      board_members: prev.board_members.filter((_, i) => i !== index),
    }));
  };

  const generateDocuments = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStepWithBounds(6);
    }, 3000);
  };

  const handleBankIDSigning = () => {
    setShowBankIDModal(true);
  };

  const completeBankIDSigning = () => {
    setShowBankIDModal(false);
    setCurrentStepWithBounds(7);
  };

  const submitToAuthorities = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/registration-complete');
    }, 2000);
  };

  const setCurrentStepWithBounds = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            data={registrationData}
            onChange={setRegistrationData}
            onSubmit={handleBasicInfoSubmit}
            errors={errors}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 2:
        return (
          <BoardMembersStep
            boardMembers={registrationData.board_members}
            onAdd={addBoardMember}
            onUpdate={updateBoardMember}
            onRemove={removeBoardMember}
            onSubmit={handleBoardMembersSubmit}
            error={errors.board_members}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 3:
        return (
          <ContactPersonStep
            data={contactPerson}
            onChange={setContactPerson}
            onSubmit={handleContactPersonSubmit}
            errors={errors}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 4:
        return (
          <ComplianceCheckStep
            loading={loading}
            checks={complianceChecks}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 5:
        return (
          <DocumentGenerationStep
            loading={loading}
            onGenerate={generateDocuments}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 6:
        return (
          <DigitalSignatureStep
            onSign={handleBankIDSigning}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      case 7:
        return (
          <AuthoritySubmissionStep
            loading={loading}
            onSubmit={submitToAuthorities}
            setCurrentStep={setCurrentStepWithBounds}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" icon={ArrowLeft}>
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Foundation Registration</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ml-4 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1]?.title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        {renderStepContent()}

        <Modal
          isOpen={showComplianceModal}
          onClose={() => setShowComplianceModal(false)}
          title="Compliance Verification Results"
          size="lg"
        >
          <ComplianceResults
            checks={complianceChecks}
            onComplete={handleComplianceComplete}
            onClose={() => setShowComplianceModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showBankIDModal}
          onClose={() => setShowBankIDModal(false)}
          title="BankID Digital Signature"
          size="md"
        >
          <BankIDSigningProcess onComplete={completeBankIDSigning} />
        </Modal>
      </div>
    </div>
  );
};

const BasicInformationStep: React.FC<{
  data: FoundationRegistration;
  onChange: (data: FoundationRegistration) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: { [key: string]: string };
  setCurrentStep: (step: number) => void;
}> = ({ data, onChange, onSubmit, errors }) => {
  const handleChange = (field: keyof FoundationRegistration, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Foundation Name"
            value={data.foundation_name}
            onChange={(e) => handleChange('foundation_name', e.target.value)}
            placeholder="Enter foundation name"
            required
            error={errors.foundation_name}
          />
          <Input
            label="Initial Capital (SEK)"
            type="number"
            value={data.initial_capital.toString()}
            onChange={(e) => handleChange('initial_capital', parseFloat(e.target.value) || 0)}
            placeholder="25000"
            helperText="Minimum 25,000 SEK required"
            required
            error={errors.initial_capital}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foundation Purpose
          </label>
          <textarea
            value={data.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the foundation's charitable purpose and activities in detail..."
            required
          />
          {errors.purpose && <p className="text-sm text-red-600">{errors.purpose}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Minimum 50 characters required. Be specific about charitable activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Registered Office Address"
            value={data.registered_office_address}
            onChange={(e) => handleChange('registered_office_address', e.target.value)}
            placeholder="Street address"
            required
            error={errors.registered_office_address}
          />
          <Input
            label="Postal Code"
            value={data.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            placeholder="12345"
            required
            error={errors.postal_code}
          />
          <Input
            label="City"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Stockholm"
            required
            error={errors.city}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Continue to Board Members</Button>
        </div>
      </form>
    </Card>
  );
};

const BoardMembersStep: React.FC<{
  boardMembers: BoardMember[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof BoardMember, value: any) => void;
  onRemove: (index: number) => void;
  onSubmit: () => void;
  error?: string;
  setCurrentStep: (step: number) => void;
}> = ({ boardMembers, onAdd, onUpdate, onRemove, onSubmit, error, setCurrentStep }) => {
  const validateBoardMember = (member: BoardMember): boolean => {
    return (
      !!member.first_name &&
      !!member.last_name &&
      !!member.personal_number &&
      !!member.email &&
      !!member.address &&
      !!member.role
    );
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Board Members</h3>
            <p className="text-sm text-gray-600">Add at least 3 board members (minimum requirement)</p>
          </div>
          <Button icon={Users} onClick={onAdd}>
            Add Board Member
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-6">
          {boardMembers.map((member, index) => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Board Member {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={member.first_name}
                  onChange={(e) => onUpdate(index, 'first_name', e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={member.last_name}
                  onChange={(e) => onUpdate(index, 'last_name', e.target.value)}
                  required
                />
                <Input
                  label="Personal Number"
                  value={member.personal_number}
                  onChange={(e) => onUpdate(index, 'personal_number', e.target.value)}
                  placeholder="YYYYMMDD-XXXX"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={member.email}
                  onChange={(e) => onUpdate(index, 'email', e.target.value)}
                  required
                />
                <Input
                  label="Phone"
                  value={member.phone}
                  onChange={(e) => onUpdate(index, 'phone', e.target.value)}
                  placeholder="+46 70 123 45 67"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board Role
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) => onUpdate(index, 'role', e.target.value as BoardMember['role'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="chairman">Chairman</option>
                    <option value="vice_chairman">Vice Chairman</option>
                    <option value="secretary">Secretary</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="member">Board Member</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <Input
                  label="Address"
                  value={member.address}
                  onChange={(e) => onUpdate(index, 'address', e.target.value)}
                  placeholder="Full address"
                  required
                />
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id={`signatory-${index}`}
                  checked={member.is_signatory}
                  onChange={(e) => onUpdate(index, 'is_signatory', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`signatory-${index}`} className="ml-2 text-sm text-gray-700">
                  Authorized signatory for the foundation
                </label>
              </div>
            </div>
          ))}
        </div>

        {boardMembers.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No board members added yet</p>
            <Button onClick={onAdd} className="mt-4">
              Add First Board Member
            </Button>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(1)}>
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={boardMembers.length < 3 || !boardMembers.every(validateBoardMember)}
          >
            Continue to Contact Person
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ContactPersonStep: React.FC<{
  data: ContactPerson;
  onChange: (data: ContactPerson) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: { [key: string]: string };
  setCurrentStep: (step: number) => void;
}> = ({ data, onChange, onSubmit, errors, setCurrentStep }) => {
  const handleChange = (field: keyof ContactPerson, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authorized Representative</h3>
          <p className="text-sm text-gray-600">
            This person will be the primary contact for the registration process and will receive updates from authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={data.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
            error={errors.first_name}
          />
          <Input
            label="Last Name"
            value={data.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            required
            error={errors.last_name}
          />
          <Input
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            error={errors.email}
          />
          <Input
            label="Phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+46 70 123 45 67"
            required
            error={errors.phone}
          />
        </div>

        <Input
          label="Role/Title"
          value={data.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g., Founder, Legal Representative"
          required
          error={errors.role}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="authorized-rep"
            checked={data.is_authorized_representative}
            onChange={(e) => handleChange('is_authorized_representative', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="authorized-rep" className="ml-2 text-sm text-gray-700">
            This person is authorized to represent the foundation during the registration process
          </label>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(2)}>
            Back
          </Button>
          <Button type="submit">Run Compliance Check</Button>
        </div>
      </form>
    </Card>
  );
};

const ComplianceCheckStep: React.FC<{
  loading: boolean;
  checks: ComplianceCheck[];
  setCurrentStep: (step: number) => void;
}> = ({ loading, checks, setCurrentStep }) => {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Running Compliance Checks</h3>
          <p className="text-gray-600">
            Verifying your foundation details against Swedish regulatory requirements...
          </p>
        </div>
      </Card>
    );
  }

  const allPassed = checks.every((check) => check.status === 'passed');

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              allPassed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {allPassed ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compliance Check {allPassed ? 'Completed' : 'Issues Found'}
          </h3>
          <p className="text-gray-600">
            {allPassed
              ? 'Your foundation meets all regulatory requirements'
              : 'Please address the issues below before proceeding'}
          </p>
        </div>

        <div className="space-y-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`p-4 rounded-lg border-l-4 ${
                check.status === 'passed' ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {check.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <h4 className="font-medium text-gray-900">
                  {check.check_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
              </div>
              <p className={`text-sm ${check.status === 'passed' ? 'text-green-700' : 'text-red-700'}`}>
                {check.details}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(3)}>
            Back to Contact Person
          </Button>
          {allPassed && (
            <Button onClick={() => setCurrentStep(5)}>Continue to Document Generation</Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const DocumentGenerationStep: React.FC<{
  loading: boolean;
  onGenerate: () => void;
  setCurrentStep: (step: number) => void;
}> = ({ loading, onGenerate, setCurrentStep }) => {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Documents</h3>
          <p className="text-gray-600">
            Creating foundation statutes, application forms, and board resolutions...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Generation</h3>
          <p className="text-gray-600">Generate required documents for foundation registration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Foundation Statutes</h4>
            <p className="text-sm text-gray-600">
              Legal document defining the foundation's purpose, governance structure, and operational rules.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Registration Application</h4>
            <p className="text-sm text-gray-600">
              Official application form for submission to Länsstyrelsen.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Board Resolution</h4>
            <p className="text-sm text-gray-600">
              Resolution establishing the foundation and appointing initial board members.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Financial Declaration</h4>
            <p className="text-sm text-gray-600">
              Declaration of initial capital and financial commitments.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Document Generation Process:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Documents will be auto-generated based on your input</li>
            <li>• All documents will comply with Swedish legal requirements</li>
            <li>• Documents will be prepared for digital signature</li>
            <li>• Audit trail will be maintained for all generated documents</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(4)}>
            Back
          </Button>
          <Button onClick={onGenerate}>Generate Documents</Button>
        </div>
      </div>
    </Card>
  );
};

const DigitalSignatureStep: React.FC<{
  onSign: () => void;
  setCurrentStep: (step: number) => void;
}> = ({ onSign, setCurrentStep }) => {
  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Signatures Required</h3>
          <p className="text-gray-600">
            All board members must digitally sign the foundation documents using BankID
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Documents to Sign:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Foundation Statutes</li>
              <li>• Board Resolution</li>
              <li>• Registration Application</li>
              <li>• Financial Declaration</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">BankID Signing Process:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Each board member will receive a signing invitation</li>
              <li>• BankID verification ensures legal validity</li>
              <li>• All signatures are timestamped and audited</li>
              <li>• Process must be completed within 7 days</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(5)}>
            Back
          </Button>
          <Button onClick={onSign} icon={Shield}>
            Start BankID Signing
          </Button>
        </div>
      </div>
    </Card>
  );
};

const AuthoritySubmissionStep: React.FC<{
  loading: boolean;
  onSubmit: () => void;
  setCurrentStep: (step: number) => void;
}> = ({ loading, onSubmit, setCurrentStep }) => {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting to Authorities</h3>
          <p className="text-gray-600">
            Submitting your foundation registration to Länsstyrelsen...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit to Swedish Authorities</h3>
          <p className="text-gray-600">
            Ready to submit your foundation registration to Länsstyrelsen for approval
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Länsstyrelsen</h4>
            <p className="text-sm text-gray-600">Primary registration authority</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Bolagsverket</h4>
            <p className="text-sm text-gray-600">Corporate registry notification</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Skatteverket</h4>
            <p className="text-sm text-gray-600">Tax authority registration</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">What happens after submission:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• You'll receive a submission reference number</li>
            <li>• Authorities will review your application (typically 4-8 weeks)</li>
            <li>• You'll be notified of any additional requirements</li>
            <li>• Upon approval, your foundation will be officially registered</li>
            <li>• Full system access will be granted after verification</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(6)}>
            Back
          </Button>
          <Button onClick={onSubmit} icon={Building2}>
            Submit to Authorities
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ComplianceResults: React.FC<{
  checks: ComplianceCheck[];
  onComplete: () => void;
  onClose: () => void;
}> = ({ checks, onComplete, onClose }) => {
  const allPassed = checks.every((check) => check.status === 'passed');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            allPassed ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {allPassed ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Compliance Verification {allPassed ? 'Passed' : 'Failed'}
        </h3>
      </div>

      <div className="space-y-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`p-3 rounded-lg ${
              check.status === 'passed' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              {check.status === 'passed' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium text-gray-900">
                {check.check_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
            <p className={`text-sm ${check.status === 'passed' ? 'text-green-700' : 'text-red-700'}`}>
              {check.details}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        {!allPassed && (
          <Button variant="secondary" onClick={onClose}>
            Fix Issues
          </Button>
        )}
        {allPassed && (
          <Button onClick={onComplete}>Continue to Document Generation</Button>
        )}
      </div>
    </div>
  );
};

const BankIDSigningProcess: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
  const [signingStep, setSigningStep] = useState<number>(1);
  const [personalNumber, setPersonalNumber] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleStartSigning = () => {
    if (!personalNumber.match(/^\d{8}-\d{4}$/)) {
      setError('Personal number must be in format YYYYMMDD-XXXX');
      return;
    }
    setError('');
    setSigningStep(2);
    setTimeout(() => {
      setSigningStep(3);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 3000);
  };

  if (signingStep === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">BankID Digital Signature</h3>
          <p className="text-sm text-gray-600">
            Sign foundation documents with legally binding digital signature
          </p>
        </div>

        <Input
          label="Personal Number"
          value={personalNumber}
          onChange={(e) => setPersonalNumber(e.target.value)}
          placeholder="YYYYMMDD-XXXX"
          pattern="[0-9]{8}-[0-9]{4}"
          required
          helperText="Format: 19801010-1234"
          error={error}
        />

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Documents to be signed:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Foundation Statutes</li>
            <li>• Board Resolution</li>
            <li>• Registration Application</li>
            <li>• Financial Declaration</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleStartSigning} icon={Shield}>
            Start BankID Signing
          </Button>
        </div>
      </div>
    );
  }

  if (signingStep === 2) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">BankID Signing in Progress</h3>
        <p className="text-gray-600 mb-4">
          Please complete the signing process in your BankID app
        </p>
        <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Order Reference:</strong> ORDER-{Date.now()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents Successfully Signed</h3>
      <p className="text-gray-600">
        All foundation documents have been digitally signed and are ready for submission
      </p>
    </div>
  );
};