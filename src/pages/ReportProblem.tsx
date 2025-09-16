import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, TreePine, FileText, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

const ReportProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    treeId: '',
    type: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Problem reported:', formData);
    toast.success('รายงานปัญหาเรียบร้อยแล้ว! เจ้าของสวนจะดำเนินการแก้ไข');
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
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-soft">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div className="w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                รายงานปัญหาในสวน
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                แจ้งปัญหาที่เกิดขึ้นในสวนทุเรียนให้เจ้าของสวนทราบ
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="treeId" className="text-foreground font-medium flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    รหัสต้นทุเรียน
                  </Label>
                  <Input
                    id="treeId"
                    type="text"
                    value={formData.treeId}
                    onChange={(e) => handleInputChange('treeId', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกรหัสต้นทุเรียน (ถ้าปัญหาเกิดที่ต้นเฉพาะ)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ประเภทปัญหา
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกประเภทปัญหา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">ปัญหารายต้น</SelectItem>
                      <SelectItem value="overview">ปัญหาภาพรวม</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    รายละเอียดปัญหา
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-[120px] resize-none border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="อธิบายปัญหาที่พบ เช่น โรคแมลง, ใบเหลือง, ดินแห้ง, ระบบน้ำเสีย ฯลฯ"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium bg-gradient-to-br from-red-500 to-red-600 hover:opacity-90 text-white transition-smooth shadow-soft"
                >
                  ส่งรายงานปัญหา
                </Button>
              </form>

              {/* Recent Problems */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">ปัญหาที่รายงานไว้</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-foreground">T045 - ใบเหลือง</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        รอแก้ไข
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ใบทุเรียนเริ่มเหลือง อาจเป็นเพราะขาดธาตุอาหาร
                    </p>
                    <p className="text-xs text-muted-foreground">เมื่อวาน 08:30</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-foreground">ภาพรวม - ระบบน้ำ</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        แก้ไขแล้ว
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ระบบสปริงเกลอร์เสีย ซ่อมแซมเรียบร้อยแล้ว
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>รายงาน: 3 วันที่แล้ว 15:20</p>
                      <p>แก้ไข: 2 วันที่แล้ว 10:45</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-foreground">T023 - แมลงศัตรูพืช</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        ดำเนินการ
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      พบแมลงเจาะลำต้น กำลังฉีดยาแก้ไข
                    </p>
                    <p className="text-xs text-muted-foreground">5 วันที่แล้ว 11:15</p>
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-700">
                      <strong>แนะนำจากเจ้าของสวน:</strong> ฉีดยาทุก 3 วัน และตัดกิ่งที่ถูกเจาะออก
                    </div>
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

export default ReportProblem;