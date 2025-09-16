import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, CreditCard, TrendingUp, TrendingDown, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const RecordFinance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paymentMethod: '',
    type: '',
    invoiceRef: '',
    amount: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Finance recorded:', formData);
    toast.success('บันทึกรายการเงินเรียบร้อยแล้ว! รอเจ้าของสวนอนุมัติ');
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
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full shadow-soft">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div className="w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                บันทึกรายรับ-รายจ่าย
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                บันทึกรายการเงินเข้า-ออก รอการอนุมัติจากเจ้าของสวน
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    ประเภทรายการ
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกประเภทรายการ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          รายรับ
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          รายจ่าย
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground font-medium flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    จำนวนเงิน (บาท)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกจำนวนเงิน"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-foreground font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    วิธีการจ่าย/รับเงิน
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกวิธีการ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">เงินสด</SelectItem>
                      <SelectItem value="transfer">โอนเงิน</SelectItem>
                      <SelectItem value="check">เช็ค</SelectItem>
                      <SelectItem value="credit">บัตรเครดิต</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceRef" className="text-foreground font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    เลขอ้างอิงใบเสร็จ
                  </Label>
                  <Input
                    id="invoiceRef"
                    type="text"
                    value={formData.invoiceRef}
                    onChange={(e) => handleInputChange('invoiceRef', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกเลขอ้างอิงใบเสร็จ (ถ้ามี)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    หมายเหตุ
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-[100px] resize-none border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="รายละเอียดเพิ่มเติม เช่น ซื้อปุ่ย, จ้างแรงงาน, ค่าน้ำ-ไฟ ฯลฯ"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium bg-gradient-to-br from-yellow-500 to-yellow-600 hover:opacity-90 text-white transition-smooth shadow-soft"
                >
                  ส่งรายการให้เจ้าของสวนอนุมัติ
                </Button>
              </form>

              {/* Pending Approval */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">รายการที่รออนุมัติ</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-foreground">ซื้อปุ่ยคอก</span>
                      </div>
                      <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                        รออนุมัติ
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">จำนวน: 2,500 บาท</p>
                    <p className="text-xs text-muted-foreground">เมื่อวาน 14:30</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-foreground">ขายทุเรียนเกรด A</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        อนุมัติแล้ว
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">จำนวน: 15,000 บาท</p>
                    <p className="text-xs text-muted-foreground">2 วันที่แล้ว 09:15</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordFinance;