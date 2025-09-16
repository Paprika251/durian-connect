import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Activity, TreePine, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const RecordActivity = () => {
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
    console.log('Activity recorded:', formData);
    toast.success('บันทึกกิจกรรมเรียบร้อยแล้ว!');
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
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-soft">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                บันทึกกิจกรรมที่ทำ
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                บันทึกกิจกรรมการดูแลและจัดการสวนทุเรียน
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
                    placeholder="กรอกรหัสต้นทุเรียน (เช่น T001)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ประเภทการบันทึก
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกประเภทการบันทึก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">รายต้น</SelectItem>
                      <SelectItem value="overview">ภาพรวม</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-foreground font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    หมายเหตุกิจกรรม
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="min-h-[120px] resize-none border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="บันทึกรายละเอียดกิจกรรม เช่น รดน้ำ, ใส่ปุ่ย, ตัดแต่งกิ่ง, ฉีดยา ฯลฯ"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-medium bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white transition-smooth shadow-soft"
                >
                  บันทึกกิจกรรม
                </Button>
              </form>

              {/* Recent Activities */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">กิจกรรมล่าสุด</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground">T001 - รดน้ำต้นทุเรียน</span>
                      <span className="text-xs text-muted-foreground">เมื่อวาน</span>
                    </div>
                    <p className="text-sm text-muted-foreground">รดน้ำต้นทุเรียนรหัส T001 ปริมาณ 20 ลิตร</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground">ภาพรวม - ใส่ปุ่ย</span>
                      <span className="text-xs text-muted-foreground">2 วันที่แล้ว</span>
                    </div>
                    <p className="text-sm text-muted-foreground">ใส่ปุ่ยคอกให้ต้นทุเรียนทั้งหมดในแปลง A</p>
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

export default RecordActivity;