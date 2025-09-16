import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, Package, DollarSign, CreditCard, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const SubmitProposal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactDeadline: '',
    quantity: '',
    proposedPrice: '',
    paymentMethod: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Proposal submitted:', formData);
    toast.success('ส่งข้อเสนอซื้อเรียบร้อยแล้ว! รอการพิจารณาจากเจ้าของสวน');
    navigate('/broker-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-between mb-4">
                <Link to="/broker-dashboard">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="p-3 bg-gradient-primary rounded-full shadow-soft">
                  <FileText className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                ยื่นข้อเสนอซื้อทุเรียน
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                กรอกรายละเอียดข้อเสนอการซื้อทุเรียนจากสวน
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contactDeadline" className="text-foreground font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    วันที่ต้องการติดต่อกลับ
                  </Label>
                  <Input
                    id="contactDeadline"
                    type="date"
                    value={formData.contactDeadline}
                    onChange={(e) => handleInputChange('contactDeadline', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-foreground font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    ปริมาณที่ต้องการ (กิโลกรัม)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกปริมาณที่ต้องการ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposedPrice" className="text-foreground font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ราคาที่เสนอ (บาท/กิโลกรัม)
                  </Label>
                  <Input
                    id="proposedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.proposedPrice}
                    onChange={(e) => handleInputChange('proposedPrice', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกราคาที่เสนอ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-foreground font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    วิธีการจ่ายเงิน
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกวิธีการจ่ายเงิน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">เงินสด</SelectItem>
                      <SelectItem value="transfer">โอนเงิน</SelectItem>
                      <SelectItem value="check">เช็ค</SelectItem>
                      <SelectItem value="installment">ผ่อนชำระ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    หมายเหตุเพิ่มเติม
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-[100px] resize-none border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="ใส่หมายเหตุหรือข้อเสนอเพิ่มเติม (ถ้ามี)"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium bg-gradient-primary hover:opacity-90 text-primary-foreground transition-smooth shadow-soft"
                >
                  ส่งข้อเสนอซื้อ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitProposal;