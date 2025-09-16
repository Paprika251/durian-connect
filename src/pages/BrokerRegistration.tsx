import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const BrokerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Broker Registration:', formData);
    toast.success('ลงทะเบียนสำเร็จ! กรุณารอการอนุมัติจากเจ้าของสวน');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-3 bg-gradient-secondary rounded-full shadow-soft">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div className="w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              ลงทะเบียนผู้รับเหมา
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              กรอกข้อมูลเพื่อสมัครเป็นผู้รับเหมาในระบบ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-12 border-border focus:ring-secondary focus:border-secondary transition-smooth"
                  placeholder="กรอกชื่อและนามสกุล"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  เบอร์โทรศัพท์
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-12 border-border focus:ring-secondary focus:border-secondary transition-smooth"
                  placeholder="กรอกหมายเลขโทรศัพท์"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 border-border focus:ring-secondary focus:border-secondary transition-smooth"
                  placeholder="กรอกที่อยู่อีเมล"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  ที่อยู่
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="min-h-[80px] resize-none border-border focus:ring-secondary focus:border-secondary transition-smooth"
                  placeholder="กรอกที่อยู่ที่สามารถติดต่อได้"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-medium bg-gradient-secondary hover:opacity-90 text-secondary-foreground transition-smooth shadow-soft"
              >
                ส่งใบสมัคร
              </Button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                มีบัญชีอยู่แล้ว?{' '}
                <Link to="/" className="text-primary hover:underline font-medium">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerRegistration;